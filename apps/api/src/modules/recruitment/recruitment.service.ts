import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class RecruitmentService {
  constructor(private prisma: PrismaService) {}

  async getRequisitions(tenantId: string) {
    return this.prisma.jobRequisition.findMany({ where: { tenantId } });
  }

  async createRequisition(tenantId: string, dto: any) {
    return this.prisma.jobRequisition.create({ data: { ...dto, tenantId } });
  }

  async getCandidates(tenantId: string) {
    return this.prisma.candidate.findMany({ where: { tenantId } });
  }

  async getApplications(tenantId: string) {
    return this.prisma.jobApplication.findMany({ where: { tenantId } });
  }

  async getInterviews(tenantId: string) {
    return this.prisma.interview.findMany({ where: { tenantId } });
  }
}
