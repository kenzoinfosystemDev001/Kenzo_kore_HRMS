import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Performance')
@ApiBearerAuth()
@Controller('performance')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @Get('review-cycles')
  @ApiOperation({ summary: 'Get review cycles' })
  getReviewCycles(@Req() req: any) {
    return this.performanceService.getReviewCycles(req.user.tenantId);
  }

  @Post('review-cycles')
  @ApiOperation({ summary: 'Create review cycle' })
  createReviewCycle(@Req() req: any, @Body() dto: any) {
    return this.performanceService.createReviewCycle(req.user.tenantId, dto);
  }

  @Get('reviews')
  @ApiOperation({ summary: 'Get reviews' })
  getReviews(@Req() req: any) {
    return this.performanceService.getReviews(req.user.tenantId);
  }

  @Post('reviews')
  @ApiOperation({ summary: 'Create review' })
  createReview(@Req() req: any, @Body() dto: any) {
    return this.performanceService.createReview(req.user.tenantId, dto);
  }

  @Get('goals')
  @ApiOperation({ summary: 'Get goals' })
  getGoals(@Req() req: any) {
    return this.performanceService.getGoals(req.user.tenantId);
  }

  @Post('goals')
  @ApiOperation({ summary: 'Create goal' })
  createGoal(@Req() req: any, @Body() dto: any) {
    return this.performanceService.createGoal(req.user.tenantId, dto);
  }
}
