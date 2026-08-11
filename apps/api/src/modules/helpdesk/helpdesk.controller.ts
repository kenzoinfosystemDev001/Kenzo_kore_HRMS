import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { HelpdeskService } from './helpdesk.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TenantId } from '../../common/decorators/tenant.decorator';

@ApiTags('Helpdesk')
@ApiBearerAuth()
@Controller('helpdesk')
export class HelpdeskController {
  constructor(private readonly helpdeskService: HelpdeskService) {}

  @Get('tickets')
  @ApiOperation({ summary: 'Get tickets' })
  getTickets(@TenantId() tenantId: string) {
    return this.helpdeskService.getTickets(tenantId);
  }

  @Post('tickets')
  @ApiOperation({ summary: 'Create ticket' })
  createTicket(@TenantId() tenantId: string, @Body() dto: CreateTicketDto) {
    return this.helpdeskService.createTicket(tenantId, dto);
  }

  @Patch('tickets/:id/status')
  @ApiOperation({ summary: 'Update ticket status' })
  updateStatus(@TenantId() tenantId: string, @Param('id') id: string, @Body('status') status: string) {
    return this.helpdeskService.updateStatus(tenantId, id, status);
  }

  @Delete('tickets/:id')
  @ApiOperation({ summary: 'Delete ticket' })
  deleteTicket(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.helpdeskService.deleteTicket(tenantId, id);
  }
}
