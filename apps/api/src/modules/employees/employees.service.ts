import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, createEmployeeDto: CreateEmployeeDto) {
    const { firstName, lastName, email, password, phone, departmentId, designationId, branchId, dateOfJoining, employmentType } = createEmployeeDto;

    const pwd = password || 'Emp@123';
    const passwordHash = await bcrypt.hash(pwd, 10);

    const orgId = await this.getOrgId(tenantId);

    // 1. Create Employee Record in PostgreSQL
    const employee = await this.prisma.employee.create({
      data: {
        tenantId,
        organizationId: orgId,
        employeeCode: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
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

    // 2. Create User Account in PostgreSQL users table
    if (email) {
      const existingUser = await this.prisma.user.findFirst({
        where: { tenantId, email: email.toLowerCase().trim() },
      });

      if (!existingUser) {
        const user = await this.prisma.user.create({
          data: {
            tenantId,
            email: email.toLowerCase().trim(),
            passwordHash,
            firstName,
            lastName,
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
