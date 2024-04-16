import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OauthConfigDto {
  @ApiProperty()
  @IsString()
  Name: string;

  @ApiProperty()
  @IsString()
  Provider: string;

  @ApiProperty()
  @IsString()
  AuthorizationUrl: string;

  @ApiProperty()
  @IsString()
  ClientId: string;
}
