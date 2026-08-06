import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Assets')
@ApiBearerAuth()
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  @ApiOperation({ summary: 'Get assets' })
  getAssets(@Req() req: any) {
    return this.assetsService.getAssets(req.user.tenantId);
  }

  @Post()
  @ApiOperation({ summary: 'Create asset' })
  createAsset(@Req() req: any, @Body() dto: any) {
    return this.assetsService.createAsset(req.user.tenantId, dto);
  }

  @Get('assignments')
  @ApiOperation({ summary: 'Get asset assignments' })
  getAssignments(@Req() req: any) {
    return this.assetsService.getAssignments(req.user.tenantId);
  }
}
