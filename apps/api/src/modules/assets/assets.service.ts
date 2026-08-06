import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AssetsService {
  constructor(private prisma: PrismaService) {}

  async getAssets(tenantId: string) {
    return this.prisma.asset.findMany({ where: { tenantId } });
  }

  async createAsset(tenantId: string, dto: any) {
    return this.prisma.asset.create({ data: { ...dto, tenantId } });
  }

  async getAssignments(tenantId: string) {
    return this.prisma.assetAssignment.findMany({ where: { tenantId } });
  }
}
