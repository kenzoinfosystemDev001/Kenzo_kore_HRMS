import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class LeaveService {
  constructor(private readonly prisma: PrismaService) {}

  async getLeaveTypes(tenantId: string) {
    return this.prisma.leaveType.findMany({ where: { tenantId, isActive: true } });
  }

  async createLeaveType(tenantId: string, data: any) {
    return this.prisma.leaveType.create({ data: { ...data, tenantId } });
  }

  async getBalances(tenantId: string, employeeId?: string) {
    const where: any = { tenantId };
    if (employeeId) where.employeeId = employeeId;
    return this.prisma.leaveBalance.findMany({
      where,
      include: { employee: true, leaveType: true },
    });
  }

  async applyLeave(tenantId: string, employeeId: string, data: any) {
    // Assuming simple calculation for totalDays here
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    return this.prisma.leaveRequest.create({
      data: {
        tenantId,
        employeeId,
        leaveTypeId: data.leaveTypeId,
        startDate,
        endDate,
        totalDays,
        reason: data.reason,
      },
    });
  }

  async listRequests(tenantId: string, employeeId?: string) {
    const where: any = { tenantId };
    if (employeeId) where.employeeId = employeeId;
    return this.prisma.leaveRequest.findMany({
      where,
      include: { employee: true, leaveType: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async approveLeave(tenantId: string, id: string, reviewerId: string, comments?: string) {
    const request = await this.prisma.leaveRequest.findFirst({ where: { id, tenantId } });
    if (!request) throw new NotFoundException('Leave request not found');
    
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.leaveRequest.update({
        where: { id },
        data: { status: 'approved', reviewedBy: reviewerId, reviewedAt: new Date(), reviewerComments: comments },
      });

      // Deduct balance
      const balance = await tx.leaveBalance.findFirst({
        where: { tenantId, employeeId: request.employeeId, leaveTypeId: request.leaveTypeId, year: new Date().getFullYear() },
      });

      if (balance) {
        await tx.leaveBalance.update({
          where: { id: balance.id },
          data: {
            used: Number(balance.used) + Number(request.totalDays),
            balance: Number(balance.balance) - Number(request.totalDays),
          },
        });
      }

      return updated;
    });
  }

  async rejectLeave(tenantId: string, id: string, reviewerId: string, comments?: string) {
    const request = await this.prisma.leaveRequest.findFirst({ where: { id, tenantId } });
    if (!request) throw new NotFoundException('Leave request not found');
    
    return this.prisma.leaveRequest.update({
      where: { id },
      data: { status: 'rejected', reviewedBy: reviewerId, reviewedAt: new Date(), reviewerComments: comments },
    });
  }
}
