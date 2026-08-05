import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async clockIn(tenantId: string, employeeId: string, data: any) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingRecord = await this.prisma.attendanceRecord.findFirst({
      where: { tenantId, employeeId, date: today },
    });

    if (existingRecord) {
      throw new BadRequestException('Already clocked in today');
    }

    return this.prisma.attendanceRecord.create({
      data: {
        tenantId,
        employeeId,
        date: today,
        checkIn: new Date(),
        checkInLocation: data.location || {},
        checkInMethod: data.method || 'web',
      },
    });
  }

  async clockOut(tenantId: string, employeeId: string, data: any) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const record = await this.prisma.attendanceRecord.findFirst({
      where: { tenantId, employeeId, date: today },
    });

    if (!record) throw new NotFoundException('No active clock-in found for today');
    if (record.checkOut) throw new BadRequestException('Already clocked out today');

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

  async findAll(tenantId: string, startDate?: Date, endDate?: Date) {
    const where: any = { tenantId };
    if (startDate && endDate) {
      where.date = { gte: startDate, lte: endDate };
    }
    return this.prisma.attendanceRecord.findMany({
      where,
      include: { employee: true },
      orderBy: { date: 'desc' },
    });
  }

  async getToday(tenantId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.prisma.attendanceRecord.findMany({
      where: { tenantId, date: today },
      include: { employee: true },
    });
  }

  async getMyAttendance(tenantId: string, employeeId: string) {
    return this.prisma.attendanceRecord.findMany({
      where: { tenantId, employeeId },
      orderBy: { date: 'desc' },
    });
  }
}
