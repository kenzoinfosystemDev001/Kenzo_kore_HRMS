import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { HelpdeskService } from './helpdesk.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

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
  createTicket(@Req() req: any, @Body() dto: any) {
    return this.helpdeskService.createTicket(req.user.tenantId, dto);
  }
}
