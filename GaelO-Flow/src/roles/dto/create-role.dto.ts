import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'admin', required: true })
  @IsString()
  Name: string;

  @ApiProperty({ example: true, required: true })
  @IsBoolean()
  Import: boolean;

  @ApiProperty({ example: true, required: true })
  @IsBoolean()
  Anonymize: boolean;

  @ApiProperty({ example: true, required: true })
  @IsBoolean()
  Export: boolean;

  @ApiProperty({ example: true, required: true })
  @IsBoolean()
  Query: boolean;

  @ApiProperty({ example: true, required: true })
  @IsBoolean()
  AutoQuery: boolean;

  @ApiProperty({ example: true, required: true })
  @IsBoolean()
  Delete: boolean;

  @ApiProperty({ example: true, required: true })
  @IsBoolean()
  Admin: boolean;

  @ApiProperty({ example: true, required: true })
  @IsBoolean()
  Modify: boolean;

  @ApiProperty({ example: true, required: true })
  @IsBoolean()
  CdBurner: boolean;

  @ApiProperty({ example: true, required: true })
  @IsBoolean()
  AutoRouting: boolean;
}
