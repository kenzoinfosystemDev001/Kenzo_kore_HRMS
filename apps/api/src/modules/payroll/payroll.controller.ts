import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreatePayrollRunDto } from './dto/create-payroll-run.dto';
import { GeneratePayslipDto } from './dto/generate-payslip.dto';
import { TenantId } from '../../common/decorators/tenant.decorator';

@ApiTags('Payroll')
@ApiBearerAuth()
@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Get('runs')
  @ApiOperation({ summary: 'Get payroll runs' })
  getPayrollRuns(@TenantId() tenantId: string) {
    return this.payrollService.getPayrollRuns(tenantId);
  }

  @Post('runs')
  @ApiOperation({ summary: 'Create payroll run' })
  createPayrollRun(@TenantId() tenantId: string, @Body() dto: CreatePayrollRunDto) {
    return this.payrollService.createPayrollRun(tenantId, dto);
  }

  @Get('payslips')
  @ApiOperation({ summary: 'Get all payslips' })
  getPayslips(@TenantId() tenantId: string) {
    return this.payrollService.getPayslips(tenantId);
  }

  @Get('payslips/:employeeId')
  @ApiOperation({ summary: 'Get payslips for employee' })
  getEmployeePayslips(@TenantId() tenantId: string, @Param('employeeId') employeeId: string) {
    return this.payrollService.getEmployeePayslips(tenantId, employeeId);
  }

  @Post('payslips/generate')
  @ApiOperation({ summary: 'Generate payslip' })
  generatePayslip(@TenantId() tenantId: string, @Body() dto: GeneratePayslipDto) {
    return this.payrollService.generatePayslip(tenantId, dto);
  }
}
