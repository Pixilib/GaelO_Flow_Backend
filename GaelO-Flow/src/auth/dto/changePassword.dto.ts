import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  NewPassword: string;

  @ApiProperty()
  @IsString()
  ConfirmationPassword: string;
}
