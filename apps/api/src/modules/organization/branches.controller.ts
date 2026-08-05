import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

@ApiTags('Branches')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  @RequirePermissions('branches:create')
  create(@TenantId() tenantId: string, @Body() data: any) {
    return this.branchesService.create(tenantId, data);
  }

  @Get()
  @RequirePermissions('branches:read')
  findAll(@TenantId() tenantId: string) {
    return this.branchesService.findAll(tenantId);
  }

  @Get(':id')
  @RequirePermissions('branches:read')
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.branchesService.findOne(tenantId, id);
  }

  @Patch(':id')
  @RequirePermissions('branches:update')
  update(@TenantId() tenantId: string, @Param('id') id: string, @Body() data: any) {
    return this.branchesService.update(tenantId, id, data);
  }

  @Delete(':id')
  @RequirePermissions('branches:delete')
  remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.branchesService.remove(tenantId, id);
  }
}
