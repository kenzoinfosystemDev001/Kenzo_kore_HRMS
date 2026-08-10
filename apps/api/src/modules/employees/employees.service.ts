import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

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

      // 2. Securely hash password using bcrypt
      const pwd = password || 'kenzo123';
      const passwordHash = await bcrypt.hash(pwd, 10);

      // 3. Resolve Organization
      let org = await tx.organization.findFirst({ where: { tenantId } });
      if (!org) {
        org = await tx.organization.create({
          data: { tenantId, name: 'Kenzo Infosystems Pvt. Ltd.' },
        });
      }

      // 4. Create Employee Record in PostgreSQL
      const employee = await tx.employee.create({
        data: {
          tenantId,
          organizationId: org.id,
          employeeCode: employeeCode || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
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

      // 5. Map Role & Create User Account in PostgreSQL
      let targetSlug = 'employee';
      let targetName = 'Employee';

      if (systemRole === 'Super_admin' || systemRole === 'super-admin') {
        targetSlug = 'super-admin';
        targetName = 'Super_admin';
      } else if (systemRole === 'Admin' || systemRole === 'admin') {
        targetSlug = 'admin';
        targetName = 'Admin';
      } else if (systemRole === 'HR' || systemRole === 'hr' || systemRole === 'hr-manager') {
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

      // 6. Audit Log Entry
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

      return { ...employee, user };
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
