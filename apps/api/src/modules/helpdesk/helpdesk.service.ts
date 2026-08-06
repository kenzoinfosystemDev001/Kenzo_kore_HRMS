import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class HelpdeskService {
  constructor(private prisma: PrismaService) {}

  async getTickets(tenantId: string) {
    return this.prisma.ticket.findMany({ where: { tenantId } });
  }

  async createTicket(tenantId: string, dto: any) {
    return this.prisma.ticket.create({ data: { ...dto, tenantId } });
  }
}
