import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreatePayrollRunDto } from './dto/create-payroll-run.dto';
import { GeneratePayslipDto } from './dto/generate-payslip.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Payroll')
@ApiBearerAuth()
@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Public()
  @Get('runs')
  @ApiOperation({ summary: 'Get payroll runs' })
  getPayrollRuns(@Req() req: any) {
    return this.payrollService.getPayrollRuns(req.user?.tenantId);
  }

  @Public()
  @Post('runs')
  @ApiOperation({ summary: 'Create payroll run' })
  createPayrollRun(@Req() req: any, @Body() dto: CreatePayrollRunDto) {
    return this.payrollService.createPayrollRun(req.user?.tenantId, dto);
  }

  @Public()
  @Get('payslips')
  @ApiOperation({ summary: 'Get all payslips' })
  getPayslips(@Req() req: any) {
    return this.payrollService.getPayslips(req.user?.tenantId);
  }

  @Public()
  @Get('payslips/:employeeId')
  @ApiOperation({ summary: 'Get payslips for employee' })
  getEmployeePayslips(@Req() req: any, @Param('employeeId') employeeId: string) {
    return this.payrollService.getEmployeePayslips(req.user?.tenantId, employeeId);
  }

  @Public()
  @Post('payslips/generate')
  @ApiOperation({ summary: 'Generate payslip' })
  generatePayslip(@Req() req: any, @Body() dto: GeneratePayslipDto) {
    return this.payrollService.generatePayslip(req.user?.tenantId, dto);
  }
}
