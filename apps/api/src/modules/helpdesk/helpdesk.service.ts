import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class HelpdeskService {
  constructor(private prisma: PrismaService) {}

  async getTickets(tenantId: string) {
    return this.prisma.ticket.findMany({
      where: { tenantId },
      include: {
        raisedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            workEmail: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createTicket(tenantId: string, dto: CreateTicketDto) {
    const { subject, category, description, priority, raisedByEmail } = dto;

    // Resolve employee from workEmail or default primary employee
    let employee = null;
    if (raisedByEmail) {
      employee = await this.prisma.employee.findFirst({
        where: { tenantId, workEmail: raisedByEmail.toLowerCase().trim() },
      });
    }

    if (!employee) {
      employee = await this.prisma.employee.findFirst({
        where: { tenantId },
      });
    }

    if (!employee) {
      throw new NotFoundException('No active employee found to associate with ticket');
    }

    const count = await this.prisma.ticket.count({ where: { tenantId } });
    const ticketNumber = `TICK-${1000 + count + 1}`;

    const ticket = await this.prisma.ticket.create({
      data: {
        tenantId,
        ticketNumber,
        subject,
        category: category || 'IT & Tools Requirement',
        description: description || '',
        priority: priority || 'Medium',
        status: 'Open',
        raisedById: employee.id,
      },
      include: {
        raisedBy: true,
      },
    });

    return ticket;
  }

  async updateStatus(tenantId: string, id: string, status: string) {
    const ticket = await this.prisma.ticket.findFirst({ where: { id, tenantId } });
    if (!ticket) throw new NotFoundException('Ticket not found');

    return this.prisma.ticket.update({
      where: { id },
      data: {
        status,
        resolvedAt: status === 'Resolved' ? new Date() : undefined,
        closedAt: status === 'Closed' ? new Date() : undefined,
      },
    });
  }

  async deleteTicket(tenantId: string, id: string) {
    const ticket = await this.prisma.ticket.findFirst({ where: { id, tenantId } });
    if (!ticket) throw new NotFoundException('Ticket not found');

    return this.prisma.ticket.delete({
      where: { id },
    });
  }
}
