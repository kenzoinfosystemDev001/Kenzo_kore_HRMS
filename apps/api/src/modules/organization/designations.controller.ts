import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DesignationsService } from './designations.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

@ApiTags('Designations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('designations')
export class DesignationsController {
  constructor(private readonly designationsService: DesignationsService) {}

  @Post()
  @RequirePermissions('designations:create')
  create(@TenantId() tenantId: string, @Body() data: any) {
    return this.designationsService.create(tenantId, data);
  }

  @Get()
  @RequirePermissions('designations:read')
  findAll(@TenantId() tenantId: string) {
    return this.designationsService.findAll(tenantId);
  }

  @Get(':id')
  @RequirePermissions('designations:read')
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.designationsService.findOne(tenantId, id);
  }

  @Patch(':id')
  @RequirePermissions('designations:update')
  update(@TenantId() tenantId: string, @Param('id') id: string, @Body() data: any) {
    return this.designationsService.update(tenantId, id, data);
  }

  @Delete(':id')
  @RequirePermissions('designations:delete')
  remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.designationsService.remove(tenantId, id);
  }
}
