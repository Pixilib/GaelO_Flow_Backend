import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { AutoroutingEventType } from '../autorouting.enum';

export class OrthancEventPayloadDto {
  @ApiProperty({ example: 'NewInstance', required: true })
  @IsEnum(AutoroutingEventType)
  ChangeType: AutoroutingEventType;

  @ApiProperty({ example: 'YYYYMMDDTHHMMSS', required: true })
  @IsString()
  Date: string;

  @ApiProperty({ example: '<uuid>', required: true })
  @IsString()
  ID: string;

  @ApiProperty({ example: '<PATH>', required: true })
  @IsString()
  Path: string;

  @ApiProperty({ example: '<RessourceType>', required: true })
  @IsString()
  ResourceType: string;

  @ApiProperty({ example: 0, required: true })
  @IsNumber()
  Seq: number;
}
