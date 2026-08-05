import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(tenantId: string) {
    const totalEmployees = await this.prisma.employee.count({ where: { tenantId, deletedAt: null } });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const presentToday = await this.prisma.attendanceRecord.count({ where: { tenantId, date: today } });
    
    const onLeave = await this.prisma.leaveRequest.count({
      where: {
        tenantId,
        status: 'approved',
        startDate: { lte: today },
        endDate: { gte: today },
      },
    });

    const pendingRequests = await this.prisma.leaveRequest.count({
      where: { tenantId, status: 'pending' },
    });

    const departmentDistribution = await this.prisma.department.findMany({
      where: { tenantId, deletedAt: null },
      include: {
        _count: {
          select: { employees: true },
        },
      },
    });

    return {
      totalEmployees,
      presentToday,
      onLeave,
      pendingRequests,
      departmentDistribution: departmentDistribution.map((d: any) => ({
        name: d.name,
        count: d._count.employees,
      })),
    };
  }
}
