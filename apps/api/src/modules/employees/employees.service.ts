import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, createEmployeeDto: CreateEmployeeDto) {
    const { firstName, lastName, email, password, phone, departmentId, designationId, branchId, employeeCode, dateOfJoining, employmentType, systemRole } = createEmployeeDto;

    const pwd = password || 'Emp@123';
    const passwordHash = await bcrypt.hash(pwd, 10);

    const orgId = await this.getOrgId(tenantId);

    // 1. Create Employee Record in PostgreSQL
    const employee = await this.prisma.employee.create({
      data: {
        tenantId,
        organizationId: orgId,
        employeeCode: employeeCode || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
        firstName,
        lastName,
        workEmail: email,
        employmentStatus: employmentType || 'active',
        dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : new Date(),
        phone,
        departmentId,
        designationId,
        branchId,
      },
    });

    // 2. Create User Account in PostgreSQL users table with explicit Role Assignment
    if (email) {
      const existingUser = await this.prisma.user.findFirst({
        where: { tenantId, email: email.toLowerCase().trim() },
      });

      if (!existingUser) {
        // Map systemRole options: Employee, Super_admin, Admin, HR
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

        let roleRecord = await this.prisma.role.findFirst({
          where: { tenantId, slug: targetSlug },
        });

        if (!roleRecord) {
          roleRecord = await this.prisma.role.create({
            data: {
              tenantId,
              name: targetName,
              slug: targetSlug,
              isSystemRole: true,
            },
          });
        }

        await this.prisma.user.create({
          data: {
            tenantId,
            email: email.toLowerCase().trim(),
            passwordHash,
            firstName,
            lastName,
            emailVerified: true,
            employeeId: employee.id,
            userRoles: roleRecord
              ? {
                  create: [{ roleId: roleRecord.id }],
                }
              : undefined,
          },
        });
      }
    }

    return employee;
  }

  private async getOrgId(tenantId: string): Promise<string> {
    const org = await this.prisma.organization.findFirst({ where: { tenantId } });
    if (org) return org.id;
    const newOrg = await this.prisma.organization.create({
      data: { tenantId, name: 'Kenzo Technologies Inc.' },
    });
    return newOrg.id;
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
