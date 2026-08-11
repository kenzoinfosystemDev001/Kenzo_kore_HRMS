import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Employees')
@ApiBearerAuth()
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Public()
  @Post()
  create(@TenantId() tenantId: string, @Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(tenantId, createEmployeeDto);
  }

  @Public()
  @Get()
  findAll(@TenantId() tenantId: string) {
    return this.employeesService.findAll(tenantId);
  }

  @Public()
  @Get(':id')
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.employeesService.findOne(tenantId, id);
  }

  @Public()
  @Patch(':id')
  update(@TenantId() tenantId: string, @Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeesService.update(tenantId, id, updateEmployeeDto);
  }

  @Public()
  @Delete(':id')
  remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.employeesService.remove(tenantId, id);
  }
}
