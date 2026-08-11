import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class LeaveService {
  constructor(private readonly prisma: PrismaService) {}

  private async resolveTenantId(tenantId?: string) {
    if (tenantId) return tenantId;
    const tenant = await this.prisma.tenant.findFirst();
    if (!tenant) throw new NotFoundException('Tenant not found');
    return tenant.id;
  }

  async getLeaveTypes(tenantId?: string) {
    const tid = await this.resolveTenantId(tenantId);
    return this.prisma.leaveType.findMany({ where: { tenantId: tid, isActive: true } });
  }

  async createLeaveType(tenantId: string | undefined, data: any) {
    const tid = await this.resolveTenantId(tenantId);
    return this.prisma.leaveType.create({ data: { ...data, tenantId: tid } });
  }

  async getBalances(tenantId?: string, employeeId?: string) {
    const tid = await this.resolveTenantId(tenantId);
    const where: any = { tenantId: tid };
    if (employeeId) where.employeeId = employeeId;
    return this.prisma.leaveBalance.findMany({
      where,
      include: { employee: true, leaveType: true },
    });
  }

  async applyLeave(tenantId: string | undefined, employeeEmailOrId: string | undefined, data: any) {
    const tid = await this.resolveTenantId(tenantId);
    
    let employee = null;
    if (employeeEmailOrId) {
      employee = await this.prisma.employee.findFirst({
        where: {
          tenantId: tid,
          OR: [
            { id: employeeEmailOrId },
            { workEmail: employeeEmailOrId.toLowerCase().trim() },
          ],
        },
      });
    }

    if (!employee) {
      employee = await this.prisma.employee.findFirst({ where: { tenantId: tid } });
    }

    if (!employee) throw new NotFoundException('Employee not found');

    let leaveType = await this.prisma.leaveType.findFirst({ where: { tenantId: tid } });
    if (!leaveType) {
      leaveType = await this.prisma.leaveType.create({
        data: { tenantId: tid, name: 'Casual Leave', code: 'CL', maxDaysPerYear: 12 },
      });
    }

    const startDate = new Date(data.startDate || data.startDateStr || new Date());
    const endDate = new Date(data.endDate || data.endDateStr || startDate);
    const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    const request = await this.prisma.leaveRequest.create({
      data: {
        tenantId: tid,
        employeeId: employee.id,
        leaveTypeId: data.leaveTypeId || leaveType.id,
        startDate,
        endDate,
        totalDays,
        reason: data.reason || 'Leave application',
        status: 'pending',
      },
      include: { employee: true, leaveType: true },
    });

    return {
      id: request.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      employeeEmail: employee.workEmail,
      type: leaveType.name,
      startDate: startDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      endDate: endDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      days: totalDays,
      reason: request.reason,
      status: 'Pending',
      appliedOn: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    };
  }

  async listRequests(tenantId?: string, employeeId?: string) {
    const tid = await this.resolveTenantId(tenantId);
    const where: any = { tenantId: tid };
    if (employeeId) where.employeeId = employeeId;
    const list = await this.prisma.leaveRequest.findMany({
      where,
      include: { employee: true, leaveType: true },
      orderBy: { createdAt: 'desc' },
    });

    return list.map(req => ({
      id: req.id,
      employeeName: `${req.employee.firstName} ${req.employee.lastName}`,
      employeeEmail: req.employee.workEmail,
      type: req.leaveType?.name || 'Casual Leave',
      startDate: new Date(req.startDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      endDate: new Date(req.endDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      days: req.totalDays,
      reason: req.reason || '',
      status: req.status === 'approved' ? 'Approved' : req.status === 'rejected' ? 'Rejected' : 'Pending',
      appliedOn: new Date(req.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    }));
  }

  async approveLeave(tenantId: string | undefined, id: string, reviewerId?: string, comments?: string) {
    const tid = await this.resolveTenantId(tenantId);
    const request = await this.prisma.leaveRequest.findFirst({ where: { id, tenantId: tid } });
    if (!request) throw new NotFoundException('Leave request not found');
    
    return this.prisma.$transaction(async (tx: any) => {
      const updated = await tx.leaveRequest.update({
        where: { id },
        data: { status: 'approved', reviewerComments: comments },
      });
      return updated;
    });
  }

  async rejectLeave(tenantId: string | undefined, id: string, reviewerId?: string, comments?: string) {
    const tid = await this.resolveTenantId(tenantId);
    const request = await this.prisma.leaveRequest.findFirst({ where: { id, tenantId: tid } });
    if (!request) throw new NotFoundException('Leave request not found');
    
    return this.prisma.leaveRequest.update({
      where: { id },
      data: { status: 'rejected', reviewerComments: comments },
    });
  }
}
