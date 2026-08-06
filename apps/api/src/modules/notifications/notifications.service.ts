import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getNotifications(tenantId: string) {
    return this.prisma.notification.findMany({ where: { tenantId } });
  }

  async createNotification(tenantId: string, dto: any) {
    return this.prisma.notification.create({ data: { ...dto, tenantId } });
  }

  async markAsRead(tenantId: string, id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });
  }
}
