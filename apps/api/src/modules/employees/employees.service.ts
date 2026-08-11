import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { normalizeSystemRole, SystemRole } from '../../common/enums/system-role.enum';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, createEmployeeDto: CreateEmployeeDto) {
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

    // Use atomic Prisma transaction so database write is all-or-nothing
    return this.prisma.$transaction(async (tx) => {
      // 1. Check duplicate email in PostgreSQL
      const existingUser = await tx.user.findFirst({
        where: { tenantId, email: normalizedEmail },
      });

      if (existingUser) {
        throw new ConflictException('An account with this email address already exists in database');
      }

      // 2. Securely hash password using bcrypt (cryptographically random temporary password if missing)
      const pwd = password && password.trim() ? password.trim() : crypto.randomBytes(8).toString('hex');
      const passwordHash = await bcrypt.hash(pwd, 10);

      // 3. Resolve Tenant Organization
      let org = await tx.organization.findFirst({ where: { tenantId } });
      if (!org) {
        const tenant = await tx.tenant.findUnique({ where: { id: tenantId } });
        if (!tenant) throw new NotFoundException('Tenant not found');
        org = await tx.organization.create({
          data: { tenantId, name: tenant.name },
        });
      }

      // 4. Generate collision-safe employee code
      let finalCode = employeeCode?.trim();
      if (!finalCode) {
        const count = await tx.employee.count({ where: { tenantId } });
        finalCode = `EMP-${1000 + count + 1}`;

        let existsCode = await tx.employee.findFirst({ where: { tenantId, employeeCode: finalCode } });
        let attempts = 0;
        while (existsCode && attempts < 10) {
          attempts++;
          finalCode = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
          existsCode = await tx.employee.findFirst({ where: { tenantId, employeeCode: finalCode } });
        }
      }

      // 5. Create Employee Record in PostgreSQL
      const employee = await tx.employee.create({
        data: {
          tenantId,
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

      // 6. Map Role via Canonical Enum & Create User Account in PostgreSQL
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
        where: { tenantId, slug: targetSlug },
      });

      if (!roleRecord) {
        roleRecord = await tx.role.create({
          data: {
            tenantId,
            name: targetName,
            slug: targetSlug,
            isSystemRole: true,
          },
        });
      }

      const user = await tx.user.create({
        data: {
          tenantId,
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

      // 7. Audit Log Entry
      await tx.auditLog.create({
        data: {
          tenantId,
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

  async findAll(tenantId: string) {
    return this.prisma.employee.findMany({
      where: { tenantId, deletedAt: null },
      include: { department: true, designation: true },
    });
  }

  async findOne(tenantId: string, id: string) {
    const employee = await this.prisma.employee.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: { department: true, designation: true, team: true, branch: true },
    });
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  async update(tenantId: string, id: string, updateEmployeeDto: UpdateEmployeeDto) {
    await this.findOne(tenantId, id); // check exists
    return this.prisma.employee.update({
      where: { id },
      data: updateEmployeeDto,
    });
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id); // check exists
    return this.prisma.employee.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
