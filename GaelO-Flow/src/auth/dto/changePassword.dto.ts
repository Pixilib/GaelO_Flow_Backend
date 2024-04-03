import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(12)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{,}$/,
    {
      message:
        'The password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
    },
  )
  NewPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ConfirmationPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  Token: string;
}
