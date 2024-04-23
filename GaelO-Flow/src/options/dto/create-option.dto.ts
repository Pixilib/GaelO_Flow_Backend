import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsNumber } from 'class-validator';

export class CreateOptionDto {
  @ApiProperty({ example: 22 })
  @IsNumber()
  AutoQueryHourStart: number;

  @ApiProperty({ example: 0 })
  @IsNumber()
  AutoQueryMinuteStart: number;

  @ApiProperty({ example: 6 })
  @IsNumber()
  AutoQueryHourStop: number;

  @ApiProperty({ example: 0 })
  @IsNumber()
  AutoQueryMinuteStop: number;

  @ApiProperty({ example: 10, required: false, default: 10 })
  @IsNumber()
  OrthancMonitoringRate: number;

  @ApiProperty({ example: true, required: false, default: true })
  @IsBoolean()
  BurnerStarted: boolean;

  @ApiProperty({ example: '', required: false, default: '' })
  @IsString()
  BurnerLabelPath: string;

  @ApiProperty({ example: 'Study', required: false, default: 'Study' })
  @IsString()
  BurnerMonitoringLevel: string;

  @ApiProperty({ example: 'Epson', required: false, default: 'Epson' })
  @IsString()
  BurnerManifacturer: string;

  @ApiProperty({ example: '', required: false, default: '' })
  @IsString()
  BurnerMonitoredPath: string;

  @ApiProperty({ example: false, required: false, default: false })
  @IsBoolean()
  BurnerDeleteStudyAfterSent: boolean;

  @ApiProperty({ example: 'Auto', required: false, default: 'Auto' })
  @IsString()
  BurnerSupportType: string;

  @ApiProperty({ example: '', required: false, default: '' })
  @IsString()
  BurnerViewerPath: string;

  @ApiProperty({ example: 'None', required: false, default: 'None' })
  @IsString()
  BurnerTransferSyntax: string;

  @ApiProperty({ example: 'uk', required: false, default: 'uk' })
  @IsString()
  BurnerDateFormat: string;

  @ApiProperty({ example: 'None', required: false, default: 'None' })
  @IsString()
  BurnerTranscoding: string;

  @ApiProperty({ example: false, required: false, default: false })
  @IsBoolean()
  AutorouterStarted: boolean;
}
