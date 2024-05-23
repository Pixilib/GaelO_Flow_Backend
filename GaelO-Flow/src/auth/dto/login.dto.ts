import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@gaelo.com' })
  @IsNotEmpty()
  Email: string;

  @ApiProperty({ example: 'passwordadmin' })
  @IsNotEmpty()
  Password: string;
}
