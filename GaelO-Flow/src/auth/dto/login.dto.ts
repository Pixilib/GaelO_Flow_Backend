import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'administrator@gaelo.fr' })
  @IsNotEmpty()
  Email: string;

  @ApiProperty({ example: 'administrator' })
  @IsNotEmpty()
  Password: string;
}
