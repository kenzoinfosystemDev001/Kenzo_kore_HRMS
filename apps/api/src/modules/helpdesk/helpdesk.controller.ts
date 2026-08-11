import { Controller, Get, Post, Patch, Delete, Body, Param, Req } from '@nestjs/common';
import { HelpdeskService } from './helpdesk.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Helpdesk')
@ApiBearerAuth()
@Controller('helpdesk')
export class HelpdeskController {
  constructor(private readonly helpdeskService: HelpdeskService) {}

  @Public()
  @Get('tickets')
  @ApiOperation({ summary: 'Get tickets' })
  getTickets(@Req() req: any) {
    return this.helpdeskService.getTickets(req.user?.tenantId);
  }

  @Public()
  @Post('tickets')
  @ApiOperation({ summary: 'Create ticket' })
  createTicket(@Req() req: any, @Body() dto: CreateTicketDto) {
    return this.helpdeskService.createTicket(req.user?.tenantId, dto);
  }

  @Public()
  @Patch('tickets/:id/status')
  @ApiOperation({ summary: 'Update ticket status' })
  updateStatus(@Req() req: any, @Param('id') id: string, @Body('status') status: string) {
    return this.helpdeskService.updateStatus(req.user?.tenantId, id, status);
  }

  @Public()
  @Delete('tickets/:id')
  @ApiOperation({ summary: 'Delete ticket' })
  deleteTicket(@Req() req: any, @Param('id') id: string) {
    return this.helpdeskService.deleteTicket(req.user?.tenantId, id);
  }
}
