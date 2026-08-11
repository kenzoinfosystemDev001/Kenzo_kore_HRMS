import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Leave')
@ApiBearerAuth()
@Controller('leave')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Public()
  @Get('types')
  getLeaveTypes(@TenantId() tenantId: string) {
    return this.leaveService.getLeaveTypes(tenantId);
  }

  @Public()
  @Post('types')
  createLeaveType(@TenantId() tenantId: string, @Body() data: any) {
    return this.leaveService.createLeaveType(tenantId, data);
  }

  @Public()
  @Get('balances')
  getBalances(@TenantId() tenantId: string, @Query('employeeId') employeeId?: string) {
    return this.leaveService.getBalances(tenantId, employeeId);
  }

  @Public()
  @Post('requests')
  applyLeave(@TenantId() tenantId: string, @Body() data: any) {
    return this.leaveService.applyLeave(tenantId, data.employeeEmail || data.employeeId, data);
  }

  @Public()
  @Get('requests')
  listRequests(@TenantId() tenantId: string, @Query('employeeId') employeeId?: string) {
    return this.leaveService.listRequests(tenantId, employeeId);
  }

  @Public()
  @Patch('requests/:id/approve')
  approveLeave(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body('comments') comments?: string,
  ) {
    return this.leaveService.approveLeave(tenantId, id, undefined, comments);
  }

  @Public()
  @Patch('requests/:id/reject')
  rejectLeave(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body('comments') comments?: string,
  ) {
    return this.leaveService.rejectLeave(tenantId, id, undefined, comments);
  }
}
