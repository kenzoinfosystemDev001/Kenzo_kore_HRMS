import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, createEmployeeDto: any) {
    const { name, firstName, lastName, email, workEmail, password, role, dept, ...rest } = createEmployeeDto;

    const fName = firstName || (name ? name.split(' ')[0] : 'Employee');
    const lName = lastName || (name ? name.split(' ').slice(1).join(' ') : 'User');
    const targetEmail = workEmail || email;
    const pwd = password || 'Emp@123';
    const passwordHash = await bcrypt.hash(pwd, 10);

    const orgId = rest.organizationId || (await this.getOrgId(tenantId));

    // 1. Create Employee Record in PostgreSQL
    const employee = await this.prisma.employee.create({
      data: {
        tenantId,
        organizationId: orgId,
        employeeCode: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
        firstName: fName,
        lastName: lName,
        workEmail: targetEmail,
        employmentStatus: 'active',
        dateOfJoining: new Date(),
        ...rest,
      },
    });

    // 2. Create User Account in PostgreSQL users table
    if (targetEmail) {
      const existingUser = await this.prisma.user.findFirst({
        where: { tenantId, email: targetEmail.toLowerCase().trim() },
      });

      if (!existingUser) {
        const user = await this.prisma.user.create({
          data: {
            tenantId,
            email: targetEmail.toLowerCase().trim(),
            passwordHash,
            firstName: fName,
            lastName: lName,
            emailVerified: true,
            employeeId: employee.id,
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

  async update(tenantId: string, id: string, updateEmployeeDto: any) {
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
