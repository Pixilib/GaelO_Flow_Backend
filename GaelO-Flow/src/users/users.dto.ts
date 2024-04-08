import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsInstance,
  IsNumber,
  IsString,
  Matches,
} from 'class-validator';
import { User } from './user.entity';
import { Role } from 'src/roles/role.entity';
import { OmitType, PickType } from '@nestjs/mapped-types';

export class UpdateUserDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  Firstname: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  Lastname: string;
}

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

  @ApiProperty({ example: 'johndoe', required: true })
  @IsString()
  Username: string;

  @ApiProperty({ example: 'john.doe@gmail.com', required: true })
  @IsEmail()
  Email: string;

  @ApiProperty({ example: true, required: true })
  @IsBoolean()
  SuperAdmin: boolean;

  @ApiProperty({ example: 'admin', required: true })
  @IsString()
  RoleName: string;

  @ApiProperty()
  @IsInstance(Role)
  Role?: Role;
}

export class CreateUserDto extends OmitType(GetUserDto, ['Id', 'Role']) {
  @ApiProperty({ example: 'myPassw0rd' })
  @IsString()
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{12,}$/, {
    message: 'Password too weak',
  })
  Password: string;
}
