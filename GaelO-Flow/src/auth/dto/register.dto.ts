import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'mail@example.com' })
  @IsEmail()
  Email: string;

  @ApiProperty({ example: 'username' })
  @IsNotEmpty()
  Username: string;

  @ApiProperty({ example: 'firstname' })
  @IsNotEmpty()
  Firstname: string;

  @ApiProperty({ example: 'lastname' })
  @IsNotEmpty()
  Lastname: string;
}
