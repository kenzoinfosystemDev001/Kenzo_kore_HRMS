import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    return this.prisma.team.create({ data: { ...data, tenantId } });
  }

  async findAll(tenantId: string) {
    return this.prisma.team.findMany({ where: { tenantId, deletedAt: null } });
  }

  async findOne(tenantId: string, id: string) {
    const team = await this.prisma.team.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
    if (!team) throw new NotFoundException('Team not found');
    return team;
  }

  async update(tenantId: string, id: string, data: any) {
    await this.findOne(tenantId, id);
    return this.prisma.team.update({ where: { id }, data });
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    return this.prisma.team.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
