import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

@ApiTags('Employees')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @RequirePermissions('employees:create')
  create(@TenantId() tenantId: string, @Body() createEmployeeDto: any) {
    return this.employeesService.create(tenantId, createEmployeeDto);
  }

  @Get()
  @RequirePermissions('employees:read')
  findAll(@TenantId() tenantId: string) {
    return this.employeesService.findAll(tenantId);
  }

  @Get(':id')
  @RequirePermissions('employees:read')
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.employeesService.findOne(tenantId, id);
  }

  @Patch(':id')
  @RequirePermissions('employees:update')
  update(@TenantId() tenantId: string, @Param('id') id: string, @Body() updateEmployeeDto: any) {
    return this.employeesService.update(tenantId, id, updateEmployeeDto);
  }

  @Delete(':id')
  @RequirePermissions('employees:delete')
  remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.employeesService.remove(tenantId, id);
  }
}
