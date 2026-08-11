import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Attendance')
@ApiBearerAuth()
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('clock-in')
  clockIn(@TenantId() tenantId: string, @CurrentUser() user: any, @Body() data: any) {
    const callerId = user?.email || user?.sub;
    return this.attendanceService.clockIn(tenantId, callerId, data);
  }

  @Post('clock-out')
  clockOut(@TenantId() tenantId: string, @CurrentUser() user: any, @Body() data: any) {
    const callerId = user?.email || user?.sub;
    return this.attendanceService.clockOut(tenantId, callerId, data);
  }

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

  @Get('today')
  getToday(@TenantId() tenantId: string) {
    return this.attendanceService.getToday(tenantId);
  }

  @Get('my')
  getMyAttendance(@TenantId() tenantId: string, @CurrentUser() user: any, @Query('employeeEmail') employeeEmail?: string) {
    const callerEmail = user?.email || employeeEmail;
    return this.attendanceService.getMyAttendance(tenantId, callerEmail);
  }
}
