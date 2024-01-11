import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'mail@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'username' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'firstname' })
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({ example: 'lastname' })
  @IsNotEmpty()
  lastname: string;
}
