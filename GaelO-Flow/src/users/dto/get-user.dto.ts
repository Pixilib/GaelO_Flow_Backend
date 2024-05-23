import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInstance, IsNumber, IsString } from 'class-validator';
import { Role } from '../../roles/role.entity';

export class GetUserDto {
  @ApiProperty()
  @IsNumber()
  Id: number;

  @ApiProperty({ example: 'John', required: true })
  @IsString()
  Firstname: string;

  @ApiProperty({ example: 'Doe', required: true })
  @IsString()
  Lastname: string;

  @ApiProperty({ example: 'john.doe@gmail.com', required: true })
  @IsEmail()
  Email: string;

  @ApiProperty({ example: 'admin', required: true })
  @IsString()
  RoleName: string;

  @ApiProperty()
  @IsInstance(Role)
  Role?: Role;
}
