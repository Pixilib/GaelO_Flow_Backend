import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsBoolean, IsNumber } from 'class-validator';
export class OptionDto {
  @IsString()
  ldapType: string;

  @IsString()
  ldapProtocol: string;

  @IsString()
  ldapServer: string;

  @IsNumber()
  ldapPort: number;

  @IsString()
  ldapBaseDn: string;

  @IsString()
  ladpBindDn: string;

  @IsString()
  ldapBindPassword: string;

  @IsString()
  ldapGroup: string;

  @IsString()
  ldapUser: string;

  @IsNumber()
  autoQueryHourStart: number;

  @IsNumber()
  autoQueryMinuteStart: number;

  @IsNumber()
  autoQueryHourStop: number;
  
  @IsNumber()
  autoQueryMinuteStop: number;

  @IsBoolean()
  useLdap: boolean;

  @IsNumber()
  orthancMonitoringRate: number;

  @IsBoolean()
  burnerStarted: boolean;

  @IsString()
  burnerLabelPath: string;

  @IsString()
  burnerMonitoringLevel: string;

  @IsString()
  burnerManifacturer: string;

  @IsString()
  burnerMonitoredPath: string;

  @IsBoolean()
  burnerDeleteStudyAfterSent: boolean;

  @IsString()
  burnerSupportType: string;

  @IsString()
  burnerViewerPath: string;

  @IsString()
  burnerTransferSyntax: string;

  @IsString()
  burnerDateFormat: string;

  @IsString()
  burnerTranscoding: string;

  @IsBoolean()
  autorouterStarted: boolean;
}

export class UpdateOptionDto extends PartialType(OptionDto) {}
