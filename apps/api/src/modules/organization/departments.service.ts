import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class DepartmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    return this.prisma.department.create({ data: { ...data, tenantId } });
  }

  async findAll(tenantId: string) {
    return this.prisma.department.findMany({ where: { tenantId, deletedAt: null } });
  }

  async findOne(tenantId: string, id: string) {
    const department = await this.prisma.department.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
    if (!department) throw new NotFoundException('Department not found');
    return department;
  }

  async update(tenantId: string, id: string, data: any) {
    await this.findOne(tenantId, id);
    return this.prisma.department.update({ where: { id }, data });
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    return this.prisma.department.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
