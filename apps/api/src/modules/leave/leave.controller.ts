import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Leave')
@ApiBearerAuth()
@Controller('leave')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Get('types')
  getLeaveTypes(@TenantId() tenantId: string) {
    return this.leaveService.getLeaveTypes(tenantId);
  }

  @Post('types')
  createLeaveType(@TenantId() tenantId: string, @Body() data: any) {
    return this.leaveService.createLeaveType(tenantId, data);
  }

  @Get('balances')
  getBalances(@TenantId() tenantId: string, @Query('employeeId') employeeId?: string) {
    return this.leaveService.getBalances(tenantId, employeeId);
  }

  @Post('requests')
  applyLeave(@TenantId() tenantId: string, @CurrentUser() user: any, @Body() data: any) {
    const callerId = user?.email || data.employeeEmail || data.employeeId;
    return this.leaveService.applyLeave(tenantId, callerId, data);
  }

  @Get('requests')
  listRequests(@TenantId() tenantId: string, @Query('employeeId') employeeId?: string) {
    return this.leaveService.listRequests(tenantId, employeeId);
  }

  @Patch('requests/:id/approve')
  approveLeave(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body('comments') comments?: string,
  ) {
    return this.leaveService.approveLeave(tenantId, id, undefined, comments);
  }

  @Patch('requests/:id/reject')
  rejectLeave(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body('comments') comments?: string,
  ) {
    return this.leaveService.rejectLeave(tenantId, id, undefined, comments);
  }
}
