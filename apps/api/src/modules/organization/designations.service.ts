import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class DesignationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    return this.prisma.designation.create({ data: { ...data, tenantId } });
  }

  async findAll(tenantId: string) {
    return this.prisma.designation.findMany({ where: { tenantId, deletedAt: null } });
  }

  async findOne(tenantId: string, id: string) {
    const designation = await this.prisma.designation.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
    if (!designation) throw new NotFoundException('Designation not found');
    return designation;
  }

  async update(tenantId: string, id: string, data: any) {
    await this.findOne(tenantId, id);
    return this.prisma.designation.update({ where: { id }, data });
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    return this.prisma.designation.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
