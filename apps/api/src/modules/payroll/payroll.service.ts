import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreatePayrollRunDto } from './dto/create-payroll-run.dto';
import { GeneratePayslipDto } from './dto/generate-payslip.dto';

@Injectable()
export class PayrollService {
  constructor(private prisma: PrismaService) {}

  async getPayrollRuns(tenantId: string) {
    return this.prisma.payrollRun.findMany({ where: { tenantId } });
  }

  async createPayrollRun(tenantId: string, dto: CreatePayrollRunDto) {
    return this.prisma.payrollRun.create({ data: { ...dto, tenantId } });
  }

  async getPayslips(tenantId: string) {
    return this.prisma.payslip.findMany({ where: { tenantId } });
  }

  async getEmployeePayslips(tenantId: string, employeeId: string) {
    return this.prisma.payslip.findMany({ where: { tenantId, employeeId } });
  }

  async generatePayslip(tenantId: string, dto: GeneratePayslipDto) {
    return this.prisma.payslip.create({
      data: {
        tenantId,
        payrollRunId: dto.payrollRunId,
        employeeId: dto.employeeId,
        month: dto.month,
        year: dto.year,
        grossSalary: dto.grossSalary ?? 0,
        totalDeductions: dto.totalDeductions ?? 0,
        netSalary: dto.netSalary ?? 0,
      },
    });
  }
}
