import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'username' })
  @IsNotEmpty()
  Username: string;

  @ApiProperty({ example: 'myPassw0rd' })
  @IsNotEmpty()
  Password: string;
}
