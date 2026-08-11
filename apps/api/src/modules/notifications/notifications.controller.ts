import { Controller, Get, Post, Patch, Body, Param, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get notifications' })
  getNotifications(@Req() req: any) {
    return this.notificationsService.getNotifications(req.user?.tenantId);
  }

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create notification' })
  createNotification(@Req() req: any, @Body() dto: any) {
    return this.notificationsService.createNotification(req.user?.tenantId, dto);
  }

  @Public()
  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  markAsRead(@Req() req: any, @Param('id') id: string) {
    return this.notificationsService.markAsRead(req.user?.tenantId, id);
  }
}
