import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class BranchesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    return this.prisma.branch.create({ data: { ...data, tenantId } });
  }

  async findAll(tenantId: string) {
    return this.prisma.branch.findMany({ where: { tenantId, deletedAt: null } });
  }

  async findOne(tenantId: string, id: string) {
    const branch = await this.prisma.branch.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
    if (!branch) throw new NotFoundException('Branch not found');
    return branch;
  }

  async update(tenantId: string, id: string, data: any) {
    await this.findOne(tenantId, id);
    return this.prisma.branch.update({ where: { id }, data });
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    return this.prisma.branch.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
