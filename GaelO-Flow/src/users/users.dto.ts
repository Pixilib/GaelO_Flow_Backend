import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { User } from './user.entity';

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
