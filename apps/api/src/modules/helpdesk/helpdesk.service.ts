import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class HelpdeskService {
  constructor(private prisma: PrismaService) {}

  private resolveTenantId(tenantId?: string) {
    if (tenantId) return tenantId;
    throw new UnauthorizedException('Tenant context is required');
  }

  async getTickets(tenantId?: string) {
    const tid = await this.resolveTenantId(tenantId);
    const tickets = await this.prisma.ticket.findMany({
      where: { tenantId: tid },
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

    return tickets.map(t => ({
      id: t.ticketNumber || t.id,
      dbId: t.id,
      subject: t.subject,
      category: t.category,
      raisedBy: `${t.raisedBy.firstName} ${t.raisedBy.lastName}`,
      raisedByEmail: t.raisedBy.workEmail,
      assignedTo: 'Admin Team',
      priority: t.priority.charAt(0).toUpperCase() + t.priority.slice(1),
      status: t.status === 'open' ? 'Open' : t.status === 'in_progress' ? 'In Progress' : t.status === 'resolved' ? 'Resolved' : t.status === 'closed' ? 'Closed' : t.status,
      description: t.description || '',
      createdAt: t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : new Date().toLocaleDateString(),
    }));
  }

  async createTicket(tenantId: string | undefined, dto: CreateTicketDto) {
    const tid = await this.resolveTenantId(tenantId);
    const { subject, category, description, priority, raisedByEmail, raisedByName } = dto;

    // Resolve employee from workEmail or default primary employee
    let employee = null;
    if (raisedByEmail) {
      employee = await this.prisma.employee.findFirst({
        where: { tenantId: tid, workEmail: raisedByEmail.toLowerCase().trim() },
      });
    }

    if (!employee) {
      employee = await this.prisma.employee.findFirst({
        where: { tenantId: tid },
      });
    }

    if (!employee) {
      throw new NotFoundException('No active employee found to associate with ticket');
    }

    const count = await this.prisma.ticket.count({ where: { tenantId: tid } });
    const ticketNumber = `TICK-${1000 + count + 1}`;

    const ticket = await this.prisma.ticket.create({
      data: {
        tenantId: tid,
        ticketNumber,
        subject,
        category: category || 'IT & Tools Requirement',
        description: description || '',
        priority: (priority || 'Medium').toLowerCase(),
        status: 'Open',
        raisedById: employee.id,
      },
      include: {
        raisedBy: true,
      },
    });

    return {
      id: ticket.ticketNumber,
      dbId: ticket.id,
      subject: ticket.subject,
      category: ticket.category,
      raisedBy: raisedByName || `${employee.firstName} ${employee.lastName}`,
      raisedByEmail: employee.workEmail,
      assignedTo: 'Admin Team',
      priority: priority || 'Medium',
      status: 'Open',
      description: ticket.description || '',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    };
  }

  async updateStatus(tenantId: string | undefined, id: string, status: string) {
    const tid = await this.resolveTenantId(tenantId);
    const ticket = await this.prisma.ticket.findFirst({
      where: {
        tenantId: tid,
        OR: [{ id }, { ticketNumber: id }],
      },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');

    return this.prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        status: status.toLowerCase(),
        resolvedAt: status === 'Resolved' ? new Date() : undefined,
        closedAt: status === 'Closed' ? new Date() : undefined,
      },
    });
  }

  async deleteTicket(tenantId: string | undefined, id: string) {
    const tid = await this.resolveTenantId(tenantId);
    const ticket = await this.prisma.ticket.findFirst({
      where: {
        tenantId: tid,
        OR: [{ id }, { ticketNumber: id }],
      },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');

    return this.prisma.ticket.delete({
      where: { id: ticket.id },
    });
  }
}
