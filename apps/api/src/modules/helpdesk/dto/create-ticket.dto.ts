import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTicketDto {
  @ApiProperty()
  @IsString()
  subject!: string;

  @ApiProperty()
  @IsString()
  category!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  raisedByEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  raisedByName?: string;
}
