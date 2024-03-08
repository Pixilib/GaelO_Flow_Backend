import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LabelDto {
  @ApiProperty({ example: 'name' })
  @IsString()
  Name: string;
}
