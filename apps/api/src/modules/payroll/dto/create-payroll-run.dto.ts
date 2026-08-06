import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreatePayrollRunDto {
  @IsNumber()
  @IsNotEmpty()
  month!: number;

  @IsNumber()
  @IsNotEmpty()
  year!: number;
}
