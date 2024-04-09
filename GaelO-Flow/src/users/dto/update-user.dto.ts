import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  Firstname: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  Lastname: string;
}
