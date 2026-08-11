import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TenantId } from '../../common/decorators/tenant.decorator';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get notifications' })
  getNotifications(@TenantId() tenantId: string) {
    return this.notificationsService.getNotifications(tenantId);
  }

  @Post()
  @ApiOperation({ summary: 'Create notification' })
  createNotification(@TenantId() tenantId: string, @Body() dto: any) {
    return this.notificationsService.createNotification(tenantId, dto);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  markAsRead(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.notificationsService.markAsRead(tenantId, id);
  }
}
