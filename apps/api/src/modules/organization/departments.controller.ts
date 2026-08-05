import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

@ApiTags('Departments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  @RequirePermissions('departments:create')
  create(@TenantId() tenantId: string, @Body() data: any) {
    return this.departmentsService.create(tenantId, data);
  }

  @Get()
  @RequirePermissions('departments:read')
  findAll(@TenantId() tenantId: string) {
    return this.departmentsService.findAll(tenantId);
  }

  @Get(':id')
  @RequirePermissions('departments:read')
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.departmentsService.findOne(tenantId, id);
  }

  @Patch(':id')
  @RequirePermissions('departments:update')
  update(@TenantId() tenantId: string, @Param('id') id: string, @Body() data: any) {
    return this.departmentsService.update(tenantId, id, data);
  }

  @Delete(':id')
  @RequirePermissions('departments:delete')
  remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.departmentsService.remove(tenantId, id);
  }
}
