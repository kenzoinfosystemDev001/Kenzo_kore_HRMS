import { Controller, Get, Post, Patch, Delete, Body, Param, Req } from '@nestjs/common';
import { HelpdeskService } from './helpdesk.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateTicketDto } from './dto/create-ticket.dto';

@ApiTags('Helpdesk')
@ApiBearerAuth()
@Controller('helpdesk')
export class HelpdeskController {
  constructor(private readonly helpdeskService: HelpdeskService) {}

  @Get('tickets')
  @ApiOperation({ summary: 'Get tickets' })
  getTickets(@Req() req: any) {
    return this.helpdeskService.getTickets(req.user.tenantId);
  }

  @Post('tickets')
  @ApiOperation({ summary: 'Create ticket' })
  createTicket(@Req() req: any, @Body() dto: CreateTicketDto) {
    return this.helpdeskService.createTicket(req.user.tenantId, dto);
  }

  @Patch('tickets/:id/status')
  @ApiOperation({ summary: 'Update ticket status' })
  updateStatus(@Req() req: any, @Param('id') id: string, @Body('status') status: string) {
    return this.helpdeskService.updateStatus(req.user.tenantId, id, status);
  }

  @Delete('tickets/:id')
  @ApiOperation({ summary: 'Delete ticket' })
  deleteTicket(@Req() req: any, @Param('id') id: string) {
    return this.helpdeskService.deleteTicket(req.user.tenantId, id);
  }
}
