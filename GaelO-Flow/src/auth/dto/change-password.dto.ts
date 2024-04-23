import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'password1234!Change' })
  @IsString()
  @IsNotEmpty()
  @MinLength(12)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W])[A-Za-z\d\W]{12,}$/, {
    message:
      'The password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
  })
  NewPassword: string;

  @ApiProperty({ example: 'password1234!Change' })
  @IsString()
  @IsNotEmpty()
  ConfirmationPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  Token: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  UserId: number;
}
