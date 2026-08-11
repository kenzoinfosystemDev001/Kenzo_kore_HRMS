import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Attendance')
@ApiBearerAuth()
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Public()
  @Post('clock-in')
  clockIn(@TenantId() tenantId: string, @Body() data: any) {
    return this.attendanceService.clockIn(tenantId, data.employeeEmail || data.employeeId, data);
  }

  @Public()
  @Post('clock-out')
  clockOut(@TenantId() tenantId: string, @Body() data: any) {
    return this.attendanceService.clockOut(tenantId, data.employeeEmail || data.employeeId, data);
  }

  @Public()
  @Get()
  findAll(
    @TenantId() tenantId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.attendanceService.findAll(
      tenantId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Public()
  @Get('today')
  getToday(@TenantId() tenantId: string) {
    return this.attendanceService.getToday(tenantId);
  }

  @Public()
  @Get('my')
  getMyAttendance(@TenantId() tenantId: string, @Query('employeeEmail') employeeEmail?: string) {
    return this.attendanceService.getMyAttendance(tenantId, employeeEmail);
  }
}
