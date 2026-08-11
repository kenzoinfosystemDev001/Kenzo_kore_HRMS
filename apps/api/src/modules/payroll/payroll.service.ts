import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreatePayrollRunDto } from './dto/create-payroll-run.dto';
import { GeneratePayslipDto } from './dto/generate-payslip.dto';

@Injectable()
export class PayrollService {
  constructor(private prisma: PrismaService) {}

  private async resolveTenantId(tenantId?: string) {
    if (tenantId) return tenantId;
    const tenant = await this.prisma.tenant.findFirst();
    if (!tenant) throw new NotFoundException('Tenant not found');
    return tenant.id;
  }

  async getPayrollRuns(tenantId?: string) {
    const tid = await this.resolveTenantId(tenantId);
    return this.prisma.payrollRun.findMany({ where: { tenantId: tid }, orderBy: { createdAt: 'desc' } });
  }

  async createPayrollRun(tenantId: string | undefined, dto: CreatePayrollRunDto) {
    const tid = await this.resolveTenantId(tenantId);
    return this.prisma.payrollRun.create({ data: { ...dto, tenantId: tid } });
  }

  async getPayslips(tenantId?: string) {
    const tid = await this.resolveTenantId(tenantId);
    const payslips = await this.prisma.payslip.findMany({
      where: { tenantId: tid },
      include: { employee: true },
      orderBy: { createdAt: 'desc' },
    });

    return payslips.map(p => ({
      id: p.id,
      employeeName: `${p.employee.firstName} ${p.employee.lastName}`,
      employeeEmail: p.employee.workEmail,
      month: `${p.month} ${p.year}`,
      basicPay: `₹${Number(p.grossSalary || 85000).toLocaleString('en-IN')}`,
      allowances: `₹${Math.round(Number(p.grossSalary || 85000) * 0.25).toLocaleString('en-IN')}`,
      deductions: `₹${Number(p.totalDeductions || 5000).toLocaleString('en-IN')}`,
      netPay: `₹${Number(p.netSalary || 80000).toLocaleString('en-IN')}`,
      status: 'Paid',
      issuedDate: new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    }));
  }

  async getEmployeePayslips(tenantId: string | undefined, employeeId: string) {
    const tid = await this.resolveTenantId(tenantId);
    return this.prisma.payslip.findMany({ where: { tenantId: tid, employeeId } });
  }

  async generatePayslip(tenantId: string | undefined, dto: GeneratePayslipDto) {
    const tid = await this.resolveTenantId(tenantId);
    return this.prisma.payslip.create({
      data: {
        tenantId: tid,
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
