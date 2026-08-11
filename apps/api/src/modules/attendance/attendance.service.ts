import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  private async resolveTenantId(tenantId?: string) {
    if (tenantId) return tenantId;
    const tenant = await this.prisma.tenant.findFirst();
    if (!tenant) throw new NotFoundException('Tenant not found');
    return tenant.id;
  }

  async clockIn(tenantId: string | undefined, employeeEmailOrId: string | undefined, data: any) {
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingRecord = await this.prisma.attendanceRecord.findFirst({
      where: { tenantId: tid, employeeId: employee.id, date: today },
    });

    if (existingRecord) {
      return existingRecord;
    }

    return this.prisma.attendanceRecord.create({
      data: {
        tenantId: tid,
        employeeId: employee.id,
        date: today,
        checkIn: new Date(),
        checkInLocation: data.location || {},
        checkInMethod: data.method || 'web',
      },
    });
  }

  async clockOut(tenantId: string | undefined, employeeEmailOrId: string | undefined, data: any) {
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const record = await this.prisma.attendanceRecord.findFirst({
      where: { tenantId: tid, employeeId: employee.id, date: today },
    });

    if (!record) {
      return this.clockIn(tid, employee.id, data);
    }

    const checkOut = new Date();
    const totalHours = (checkOut.getTime() - record.checkIn!.getTime()) / (1000 * 60 * 60);

    return this.prisma.attendanceRecord.update({
      where: { id: record.id },
      data: {
        checkOut,
        checkOutLocation: data.location || {},
        checkOutMethod: data.method || 'web',
        totalHours,
      },
    });
  }

  async findAll(tenantId?: string, startDate?: Date, endDate?: Date) {
    const tid = await this.resolveTenantId(tenantId);
    const where: any = { tenantId: tid };
    if (startDate && endDate) {
      where.date = { gte: startDate, lte: endDate };
    }
    return this.prisma.attendanceRecord.findMany({
      where,
      include: { employee: true },
      orderBy: { date: 'desc' },
    });
  }

  async getToday(tenantId?: string) {
    const tid = await this.resolveTenantId(tenantId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.prisma.attendanceRecord.findMany({
      where: { tenantId: tid, date: today },
      include: { employee: true },
    });
  }

  async getMyAttendance(tenantId?: string, employeeEmailOrId?: string) {
    const tid = await this.resolveTenantId(tenantId);
    let employeeId = employeeEmailOrId;
    if (employeeEmailOrId && employeeEmailOrId.includes('@')) {
      const emp = await this.prisma.employee.findFirst({
        where: { tenantId: tid, workEmail: employeeEmailOrId.toLowerCase().trim() },
      });
      if (emp) employeeId = emp.id;
    }

    const where: any = { tenantId: tid };
    if (employeeId) where.employeeId = employeeId;

    return this.prisma.attendanceRecord.findMany({
      where,
      orderBy: { date: 'desc' },
    });
  }
}
