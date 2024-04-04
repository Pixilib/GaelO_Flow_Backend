import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LostPassworDto {
  @ApiProperty({ example: 'user1@mail.com' })
  @IsNotEmpty()
  Email: string;
}
