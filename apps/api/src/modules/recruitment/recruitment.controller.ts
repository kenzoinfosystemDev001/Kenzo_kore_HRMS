import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { RecruitmentService } from './recruitment.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Recruitment')
@ApiBearerAuth()
@Controller('recruitment')
export class RecruitmentController {
  constructor(private readonly recruitmentService: RecruitmentService) {}

  @Get('requisitions')
  @ApiOperation({ summary: 'Get job requisitions' })
  getRequisitions(@Req() req: any) {
    return this.recruitmentService.getRequisitions(req.user.tenantId);
  }

  @Post('requisitions')
  @ApiOperation({ summary: 'Create job requisition' })
  createRequisition(@Req() req: any, @Body() dto: any) {
    return this.recruitmentService.createRequisition(req.user.tenantId, dto);
  }

  @Get('candidates')
  @ApiOperation({ summary: 'Get candidates' })
  getCandidates(@Req() req: any) {
    return this.recruitmentService.getCandidates(req.user.tenantId);
  }

  @Get('applications')
  @ApiOperation({ summary: 'Get applications' })
  getApplications(@Req() req: any) {
    return this.recruitmentService.getApplications(req.user.tenantId);
  }
  
  @Get('interviews')
  @ApiOperation({ summary: 'Get interviews' })
  getInterviews(@Req() req: any) {
    return this.recruitmentService.getInterviews(req.user.tenantId);
  }
}
