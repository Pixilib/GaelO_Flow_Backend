import { ApiHideProperty, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { User } from './user.entity';
import { Exclude } from 'class-transformer';
import { Role } from '../roles/role.entity';

export class UpdateUserDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  Firstname: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  Lastname: string;
}

export class GetUserDto extends User {}

export class CreateUserDto extends GetUserDto {
  @ApiProperty({ example: 'myPassw0rd' })
  @IsString()
  Password: string;
}
