import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';

@ApiTags('Leave')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('leave')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Get('types')
  getLeaveTypes(@TenantId() tenantId: string) {
    return this.leaveService.getLeaveTypes(tenantId);
  }

  @Post('types')
  @RequirePermissions('leave:manage')
  createLeaveType(@TenantId() tenantId: string, @Body() data: any) {
    return this.leaveService.createLeaveType(tenantId, data);
  }

  @Get('balances')
  getBalances(@TenantId() tenantId: string, @Query('employeeId') employeeId?: string) {
    return this.leaveService.getBalances(tenantId, employeeId);
  }

  @Post('requests')
  applyLeave(@TenantId() tenantId: string, @CurrentUser() user: AuthenticatedUser, @Body() data: any) {
    return this.leaveService.applyLeave(tenantId, user.employeeId!, data);
  }

  @Get('requests')
  listRequests(@TenantId() tenantId: string, @Query('employeeId') employeeId?: string) {
    return this.leaveService.listRequests(tenantId, employeeId);
  }

  @Patch('requests/:id/approve')
  @RequirePermissions('leave:approve')
  approveLeave(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body('comments') comments?: string,
  ) {
    return this.leaveService.approveLeave(tenantId, id, user.employeeId!, comments);
  }

  @Patch('requests/:id/reject')
  @RequirePermissions('leave:approve')
  rejectLeave(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body('comments') comments?: string,
  ) {
    return this.leaveService.rejectLeave(tenantId, id, user.employeeId!, comments);
  }
}
