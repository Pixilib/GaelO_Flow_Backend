import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsBoolean, IsNumber } from 'class-validator';

export class OptionDto {
  @ApiProperty({ example: null, required: false, default: null })
  @IsString()
  ldapType: string;

  @ApiProperty({ example: null, required: false, default: null })
  @IsString()
  ldapProtocol: string;

  @ApiProperty({ example: null, required: false, default: null })
  @IsString()
  ldapServer: string;

  @ApiProperty({ example: null, required: false, default: null })
  @IsNumber()
  ldapPort: number;

  @ApiProperty({ example: null, required: false, default: null })
  @IsString()
  ldapBaseDn: string;

  @ApiProperty({ example: null, required: false, default: null })
  @IsString()
  ladpBindDn: string;

  @ApiProperty({ example: null, required: false, default: null })
  @IsString()
  ldapBindPassword: string;

  @ApiProperty({ example: null, required: false, default: null })
  @IsString()
  ldapGroup: string;

  @ApiProperty({ example: null, required: false, default: null })
  @IsString()
  ldapUser: string;

  @ApiProperty({ example: 22 })
  @IsNumber()
  autoQueryHourStart: number;

  @ApiProperty({ example: 0 })
  @IsNumber()
  autoQueryMinuteStart: number;

  @ApiProperty({ example: 6 })
  @IsNumber()
  autoQueryHourStop: number;

  @ApiProperty({ example: 0 })
  @IsNumber()
  autoQueryMinuteStop: number;

  @ApiProperty({ example: false, required: false, default: false })
  @IsBoolean()
  useLdap: boolean;

  @ApiProperty({ example: 10, required: false, default: 10 })
  @IsNumber()
  orthancMonitoringRate: number;

  @ApiProperty({ example: true, required: false, default: true })
  @IsBoolean()
  burnerStarted: boolean;

  @ApiProperty({ example: '', required: false, default: '' })
  @IsString()
  burnerLabelPath: string;

  @ApiProperty({ example: 'Study', required: false, default: 'Study' })
  @IsString()
  burnerMonitoringLevel: string;

  @ApiProperty({ example: 'Epson', required: false, default: 'Epson' })
  @IsString()
  burnerManifacturer: string;

  @ApiProperty({ example: '', required: false, default: '' })
  @IsString()
  burnerMonitoredPath: string;

  @ApiProperty({ example: false, required: false, default: false })
  @IsBoolean()
  burnerDeleteStudyAfterSent: boolean;

  @ApiProperty({ example: 'Auto', required: false, default: 'Auto' })
  @IsString()
  burnerSupportType: string;

  @ApiProperty({ example: '', required: false, default: '' })
  @IsString()
  burnerViewerPath: string;

  @ApiProperty({ example: 'None', required: false, default: 'None' })
  @IsString()
  burnerTransferSyntax: string;

  @ApiProperty({ example: 'uk', required: false, default: 'uk' })
  @IsString()
  burnerDateFormat: string;

  @ApiProperty({ example: 'None', required: false, default: 'None' })
  @IsString()
  burnerTranscoding: string;

  @ApiProperty({ example: false, required: false, default: false })
  @IsBoolean()
  autorouterStarted: boolean;
}

export class UpdateOptionDto extends PartialType(OptionDto) {}
