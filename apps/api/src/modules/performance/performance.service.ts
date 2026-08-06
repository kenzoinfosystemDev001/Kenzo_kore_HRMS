import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class PerformanceService {
  constructor(private prisma: PrismaService) {}

  async getReviewCycles(tenantId: string) {
    return this.prisma.reviewCycle.findMany({ where: { tenantId } });
  }

  async createReviewCycle(tenantId: string, dto: any) {
    return this.prisma.reviewCycle.create({ data: { ...dto, tenantId } });
  }

  async getReviews(tenantId: string) {
    return this.prisma.performanceReview.findMany({ where: { tenantId } });
  }

  async createReview(tenantId: string, dto: any) {
    return this.prisma.performanceReview.create({ data: { ...dto, tenantId } });
  }

  async getGoals(tenantId: string) {
    return this.prisma.goal.findMany({ where: { tenantId } });
  }

  async createGoal(tenantId: string, dto: any) {
    return this.prisma.goal.create({ data: { ...dto, tenantId } });
  }
}
