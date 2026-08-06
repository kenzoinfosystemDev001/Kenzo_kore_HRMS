import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class GeneratePayslipDto {
  @IsString()
  @IsNotEmpty()
  employeeId!: string;

  @IsString()
  @IsNotEmpty()
  payrollRunId!: string;

  @IsNumber()
  @IsNotEmpty()
  month!: number;

  @IsNumber()
  @IsNotEmpty()
  year!: number;

  @IsNumber()
  @IsOptional()
  grossSalary?: number;

  @IsNumber()
  @IsOptional()
  totalDeductions?: number;

  @IsNumber()
  @IsOptional()
  netSalary?: number;
}
