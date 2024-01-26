import { ApiHideProperty, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { User } from './user.entity';
import { Exclude } from 'class-transformer';
import { Role } from '../roles/role.entity';

export class UpdateUserDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  firstname: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastname: string;
}

export class GetUserDto extends User {}

export class CreateUserDto extends GetUserDto {
  @ApiProperty({ example: 'myPassw0rd' })
  @IsString()
  password: string;
}
