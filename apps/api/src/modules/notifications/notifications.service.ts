import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  private async resolveTenantId(tenantId?: string) {
    if (tenantId) return tenantId;
    const tenant = await this.prisma.tenant.findFirst();
    if (!tenant) throw new NotFoundException('Tenant not found');
    return tenant.id;
  }

  async getNotifications(tenantId?: string) {
    const tid = await this.resolveTenantId(tenantId);
    return this.prisma.notification.findMany({ where: { tenantId: tid }, orderBy: { createdAt: 'desc' } });
  }

  async createNotification(tenantId: string | undefined, dto: any) {
    const tid = await this.resolveTenantId(tenantId);
    let user = null;
    if (dto.targetEmail) {
      user = await this.prisma.user.findFirst({
        where: { tenantId: tid, email: dto.targetEmail.toLowerCase().trim() },
      });
    }

    if (!user) {
      user = await this.prisma.user.findFirst({ where: { tenantId: tid } });
    }

    if (!user) throw new NotFoundException('User not found');

    return this.prisma.notification.create({
      data: {
        tenantId: tid,
        userId: user.id,
        title: dto.title || 'System Notification',
        message: dto.message || '',
        type: (dto.type || 'INFO').toUpperCase(),
        isRead: false,
      },
    });
  }

  async markAsRead(tenantId: string | undefined, id: string) {
    const tid = await this.resolveTenantId(tenantId);
    const notif = await this.prisma.notification.findFirst({ where: { id, tenantId: tid } });
    if (!notif) return null;

    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true, readAt: new Date() },
    });
  }
}
