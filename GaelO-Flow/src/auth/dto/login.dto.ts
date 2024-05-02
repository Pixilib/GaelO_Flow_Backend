import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'email@gaelo.com' })
  @IsNotEmpty()
  Email: string;

  @ApiProperty({ example: 'myPassw0rd' })
  @IsNotEmpty()
  Password: string;
}
