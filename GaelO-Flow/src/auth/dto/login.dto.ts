import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'username' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'myPassw0rd' })
  @IsNotEmpty()
  password: string;
}
