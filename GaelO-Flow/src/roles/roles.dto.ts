import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class RoleDto {
  @ApiProperty({ example: 'admin' })
  @IsString()
  Name: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  Import: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  Anonymize: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  Export: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  Query: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  AutoQuery: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  Delete: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  Admin: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  Modify: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  CdBurner: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  AutoRouting: boolean;
}

export class WithLabels {
  @IsOptional()
  @ApiProperty({ example: true })
  @Transform(
    ({ value }) => {
      return value === 'true' || value === '';
    },
    { toClassOnly: true },
  )
  @IsBoolean()
  WithLabels: boolean = false;
}
