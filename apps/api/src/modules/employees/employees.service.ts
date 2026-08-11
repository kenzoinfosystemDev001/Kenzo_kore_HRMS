import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { normalizeSystemRole, SystemRole } from '../../common/enums/system-role.enum';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  private resolveTenantId(tenantId?: string) {
    if (tenantId) return tenantId;
    throw new UnauthorizedException('Tenant context is required');
  }

  async create(tenantId: string | undefined, createEmployeeDto: CreateEmployeeDto) {
    const tid = await this.resolveTenantId(tenantId);
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      phone, 
      departmentId, 
      designationId, 
      branchId, 
      employeeCode, 
      dateOfJoining, 
      employmentType, 
      systemRole 
    } = createEmployeeDto;

    const normalizedEmail = email ? email.toLowerCase().trim() : '';

    if (!normalizedEmail) {
      throw new ConflictException('Work email address is required');
    }

    return this.prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findFirst({
        where: { tenantId: tid, email: normalizedEmail },
      });

      if (existingUser) {
        throw new ConflictException('An account with this email address already exists in database');
      }

      if (departmentId) {
        const deptExists = await tx.department.findFirst({ where: { id: departmentId, tenantId: tid } });
        if (!deptExists) throw new NotFoundException('Specified department does not exist in tenant');
      }

      if (designationId) {
        const desigExists = await tx.designation.findFirst({ where: { id: designationId, tenantId: tid } });
        if (!desigExists) throw new NotFoundException('Specified designation does not exist in tenant');
      }

      const pwd = password && password.trim() ? password.trim() : crypto.randomBytes(8).toString('hex');
      const passwordHash = await bcrypt.hash(pwd, 10);

      let org = await tx.organization.findFirst({ where: { tenantId: tid } });
      if (!org) {
        const tenant = await tx.tenant.findUnique({ where: { id: tid } });
        if (!tenant) throw new NotFoundException('Tenant not found');
        org = await tx.organization.create({
          data: { tenantId: tid, name: tenant.name },
        });
      }

      let finalCode = employeeCode?.trim();
      if (!finalCode) {
        const count = await tx.employee.count({ where: { tenantId: tid } });
        let seq = count + 1;
        finalCode = `EMP-${String(seq).padStart(5, '0')}`;

        let existsCode = await tx.employee.findFirst({ where: { tenantId: tid, employeeCode: finalCode } });
        while (existsCode) {
          seq++;
          finalCode = `EMP-${String(seq).padStart(5, '0')}`;
          existsCode = await tx.employee.findFirst({ where: { tenantId: tid, employeeCode: finalCode } });
        }
      } else {
        const existsCode = await tx.employee.findFirst({ where: { tenantId: tid, employeeCode: finalCode } });
        if (existsCode) {
          throw new ConflictException(`Employee code '${finalCode}' already exists for this tenant`);
        }
      }

      const employee = await tx.employee.create({
        data: {
          tenantId: tid,
          organizationId: org.id,
          employeeCode: finalCode,
          firstName,
          lastName,
          workEmail: normalizedEmail,
          employmentStatus: employmentType || 'active',
          dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : new Date(),
          phone,
          departmentId,
          designationId,
          branchId,
        },
      });

      const canonRole = normalizeSystemRole(systemRole);
      let targetSlug = 'employee';
      let targetName = 'Employee';

      if (canonRole === SystemRole.SUPER_ADMIN) {
        targetSlug = 'super-admin';
        targetName = 'Super_admin';
      } else if (canonRole === SystemRole.ADMIN) {
        targetSlug = 'admin';
        targetName = 'Admin';
      } else if (canonRole === SystemRole.HR) {
        targetSlug = 'hr';
        targetName = 'HR';
      }

      let roleRecord = await tx.role.findFirst({
        where: { tenantId: tid, slug: targetSlug },
      });

      if (!roleRecord) {
        roleRecord = await tx.role.create({
          data: {
            tenantId: tid,
            name: targetName,
            slug: targetSlug,
            isSystemRole: true,
          },
        });
      }

      const user = await tx.user.create({
        data: {
          tenantId: tid,
          email: normalizedEmail,
          passwordHash,
          firstName,
          lastName,
          emailVerified: true,
          employeeId: employee.id,
          userRoles: {
            create: [{ roleId: roleRecord.id }],
          },
        },
      });

      await tx.auditLog.create({
        data: {
          tenantId: tid,
          userId: user.id,
          action: 'EMPLOYEE_CREATED',
          entityType: 'Employee',
          entityId: employee.id,
          metadata: { createdBy: 'Admin', email: normalizedEmail, role: targetName },
        },
      });

      return { ...employee, user, generatedTempPassword: password ? undefined : pwd };
    });
  }

  async findAll(tenantId?: string) {
    const tid = await this.resolveTenantId(tenantId);
    return this.prisma.employee.findMany({
      where: { tenantId: tid, deletedAt: null },
      include: { department: true, designation: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(tenantId: string | undefined, id: string) {
    const tid = await this.resolveTenantId(tenantId);
    const employee = await this.prisma.employee.findFirst({
      where: { id, tenantId: tid, deletedAt: null },
      include: { department: true, designation: true, team: true, branch: true },
    });
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  async update(tenantId: string | undefined, id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const tid = await this.resolveTenantId(tenantId);
    await this.findOne(tid, id); // check exists
    return this.prisma.employee.update({
      where: { id },
      data: updateEmployeeDto,
    });
  }

  async remove(tenantId: string | undefined, id: string) {
    const tid = await this.resolveTenantId(tenantId);
    await this.findOne(tid, id); // check exists
    return this.prisma.employee.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
