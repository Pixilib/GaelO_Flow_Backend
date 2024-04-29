import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsString, Matches } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John', required: true })
  @IsString()
  Firstname: string;

  @ApiProperty({ example: 'Doe', required: true })
  @IsString()
  Lastname: string;

  @ApiProperty({ example: 'johndoe', required: true })
  @IsString()
  Username: string;

  @ApiProperty({ example: 'john.doe@gmail.com', required: true })
  @IsEmail()
  Email: string;

  @ApiProperty({ example: true, required: true })
  @IsBoolean()
  SuperAdmin: boolean;

  @ApiProperty({ example: 'Admin', required: true })
  @IsString()
  RoleName: string;

  @ApiProperty({ example: 'myPassw0rd1234!' })
  @IsString()
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{12,}$/, {
    message: 'Password too weak',
  })
  Password: string;
}
