import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  email!: string;
  
  @ApiProperty()
  firstName!: string;
  
  @ApiProperty()
  lastName!: string;

  @ApiProperty()
  roles!: string[];

  @ApiProperty()
  permissions!: string[];
}

export class AuthResponseDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  refreshToken!: string;

  @ApiProperty()
  user!: AuthUserDto;
}
