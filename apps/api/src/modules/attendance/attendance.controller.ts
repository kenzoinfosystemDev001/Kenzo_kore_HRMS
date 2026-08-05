import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';

@ApiTags('Attendance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('clock-in')
  clockIn(@TenantId() tenantId: string, @CurrentUser() user: AuthenticatedUser, @Body() data: any) {
    return this.attendanceService.clockIn(tenantId, user.employeeId!, data);
  }

  @Post('clock-out')
  clockOut(@TenantId() tenantId: string, @CurrentUser() user: AuthenticatedUser, @Body() data: any) {
    return this.attendanceService.clockOut(tenantId, user.employeeId!, data);
  }

  @Get()
  @RequirePermissions('attendance:read')
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
  @RequirePermissions('attendance:read')
  getToday(@TenantId() tenantId: string) {
    return this.attendanceService.getToday(tenantId);
  }

  @Get('my')
  getMyAttendance(@TenantId() tenantId: string, @CurrentUser() user: AuthenticatedUser) {
    return this.attendanceService.getMyAttendance(tenantId, user.employeeId!);
  }
}
