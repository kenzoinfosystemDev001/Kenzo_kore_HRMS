import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  private async resolveTenantId(tenantId?: string) {
    if (tenantId) return tenantId;
    const tenant = await this.prisma.tenant.findFirst({ where: { isActive: true } });
    if (tenant) return tenant.id;
    throw new UnauthorizedException('Tenant context is required');
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

    if (!employee) {
      let org = await this.prisma.organization.findFirst({ where: { tenantId: tid } });
      if (!org) {
        org = await this.prisma.organization.create({ data: { tenantId: tid, name: 'Default Organization' } });
      }
      const email = (employeeEmailOrId || data.employeeEmail || 'employee@kenzoinfosystems.com').toLowerCase().trim();
      employee = await this.prisma.employee.create({
        data: {
          tenantId: tid,
          organizationId: org.id,
          employeeCode: `EMP-${Date.now().toString().slice(-5)}`,
          firstName: data.employeeName?.split(' ')[0] || 'Team',
          lastName: data.employeeName?.split(' ').slice(1).join(' ') || 'Member',
          workEmail: email,
          dateOfJoining: new Date(),
        },
      });
    }

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
        status: 'present',
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

    if (!employee) {
      throw new BadRequestException('Employee record not found');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const record = await this.prisma.attendanceRecord.findFirst({
      where: { tenantId: tid, employeeId: employee.id, date: today },
    });

    if (!record) {
      throw new BadRequestException('ATTENDANCE_NOT_STARTED: Cannot clock out before clocking in for today');
    }

    const checkOut = new Date();
    const totalHours = (checkOut.getTime() - (record.checkIn ? record.checkIn.getTime() : checkOut.getTime())) / (1000 * 60 * 60);

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
    const targetDate = startDate || new Date();
    targetDate.setHours(0, 0, 0, 0);

    // Query ALL active employees in the tenant from PostgreSQL DB
    const allEmployees = await this.prisma.employee.findMany({
      where: { tenantId: tid, deletedAt: null },
      include: { department: true, designation: true },
      orderBy: { createdAt: 'asc' },
    });

    // Query attendance records for target date range from PostgreSQL DB
    const attendanceWhere: any = { tenantId: tid };
    if (startDate && endDate) {
      attendanceWhere.date = { gte: startDate, lte: endDate };
    } else {
      attendanceWhere.date = targetDate;
    }

    const todayRecords = await this.prisma.attendanceRecord.findMany({
      where: attendanceWhere,
    });

    const recordMap = new Map(todayRecords.map(r => [r.employeeId, r]));

    // Return complete company roster of ALL employees stored in PostgreSQL
    return allEmployees.map(emp => {
      const rec = recordMap.get(emp.id);
      const totalHrs = rec?.totalHours ? Number(rec.totalHours) : undefined;
      return {
        id: rec?.id || `ATT-TMP-${emp.id.slice(0, 8)}`,
        employeeId: emp.id,
        employeeEmail: emp.workEmail || `${emp.firstName.toLowerCase()}@kenzoinfosystems.com`,
        employeeName: `${emp.firstName} ${emp.lastName}`.trim(),
        date: targetDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        checkIn: rec?.checkIn ? new Date(rec.checkIn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : undefined,
        checkOut: rec?.checkOut ? new Date(rec.checkOut).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : undefined,
        status: rec ? (totalHrs && totalHrs < 4 ? 'Half Day' : 'Present') : 'Absent',
        workHours: totalHrs ? `${totalHrs.toFixed(1)} hrs` : undefined,
        totalHours: totalHrs,
        location: rec?.checkInMethod || 'Office Web Portal',
        department: emp.department?.name || 'General',
      };
    });
  }

  async getToday(tenantId?: string) {
    return this.findAll(tenantId);
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

    const records = await this.prisma.attendanceRecord.findMany({
      where,
      include: { employee: true },
      orderBy: { date: 'desc' },
    });

    return records.map(rec => ({
      id: rec.id,
      employeeId: rec.employeeId,
      employeeEmail: rec.employee?.workEmail || '',
      employeeName: `${rec.employee?.firstName || ''} ${rec.employee?.lastName || ''}`.trim(),
      date: new Date(rec.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      checkIn: rec.checkIn ? new Date(rec.checkIn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : undefined,
      checkOut: rec.checkOut ? new Date(rec.checkOut).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : undefined,
      status: rec.status === 'present' ? 'Present' : 'Absent',
      workHours: rec.totalHours ? `${Number(rec.totalHours).toFixed(1)} hrs` : undefined,
    }));
  }
}
