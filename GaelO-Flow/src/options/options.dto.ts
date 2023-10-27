import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsBoolean, IsNumber } from 'class-validator';
export class OptionDto {
  @IsString()
  ldap_type: string;

  @IsString()
  ldap_protocol: string;

  @IsString()
  ldap_server: string;

  @IsNumber()
  ldap_port: number;

  @IsString()
  ldap_base_dn: string;

  @IsString()
  ladp_bind_dn: string;

  @IsString()
  ldap_bind_password: string;

  @IsString()
  ldap_group: string;

  @IsString()
  ldap_user: string;

  @IsNumber()
  auto_query_hour_start: number;

  @IsNumber()
  auto_query_minute_start: number;

  @IsNumber()
  auto_query_hour_stop: number;
  
  @IsNumber()
  auto_query_minute_stop: number;

  @IsBoolean()
  use_ldap: boolean;

  @IsNumber()
  orthanc_monitoring_rate: number;

  @IsBoolean()
  burner_started: boolean;

  @IsString()
  burner_label_path: string;

  @IsString()
  burner_monitoring_level: string;

  @IsString()
  burner_manifacturer: string;

  @IsString()
  burner_monitored_path: string;

  @IsBoolean()
  burner_delete_study_after_sent: boolean;

  @IsString()
  burner_support_type: string;

  @IsString()
  burner_viewer_path: string;

  @IsString()
  burner_transfer_syntax: string;

  @IsString()
  burner_date_format: string;

  @IsString()
  burner_transcoding: string;

  @IsBoolean()
  autorouter_started: boolean;
}

export class UpdateOptionDto extends PartialType(OptionDto) {}
