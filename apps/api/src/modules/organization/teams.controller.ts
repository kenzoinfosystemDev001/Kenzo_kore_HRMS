import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

@ApiTags('Teams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @RequirePermissions('teams:create')
  create(@TenantId() tenantId: string, @Body() data: any) {
    return this.teamsService.create(tenantId, data);
  }

  @Get()
  @RequirePermissions('teams:read')
  findAll(@TenantId() tenantId: string) {
    return this.teamsService.findAll(tenantId);
  }

  @Get(':id')
  @RequirePermissions('teams:read')
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.teamsService.findOne(tenantId, id);
  }

  @Patch(':id')
  @RequirePermissions('teams:update')
  update(@TenantId() tenantId: string, @Param('id') id: string, @Body() data: any) {
    return this.teamsService.update(tenantId, id, data);
  }

  @Delete(':id')
  @RequirePermissions('teams:delete')
  remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.teamsService.remove(tenantId, id);
  }
}
