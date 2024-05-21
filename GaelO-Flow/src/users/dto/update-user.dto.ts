import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'John', required: true })
  @IsString()
  Firstname: string;

  @ApiProperty({ example: 'Doe', required: true })
  @IsString()
  Lastname: string;

  @ApiProperty({ example: 'john.doe@gaelo.com', required: true })
  @IsString()
  Email: string;

  @ApiProperty({ example: 'Admin', required: true })
  @IsString()
  RoleName: string;
}
