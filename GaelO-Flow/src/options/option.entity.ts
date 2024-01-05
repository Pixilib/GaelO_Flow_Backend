import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Option {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ example: null, required: false, default: null })
  @Column({ nullable: true, default: null, name: 'ldap_type' })
  ldapType: string;

  @ApiProperty({ example: null, required: false, default: null })
  @Column({ nullable: true, default: null, name: 'ldap_protocol' })
  ldapProtocol: string;

  @ApiProperty({ example: null, required: false, default: null })
  @Column({ nullable: true, default: null, name: 'ldap_server' })
  ldapServer: string;

  @ApiProperty({ example: null, required: false, default: null })
  @Column({ nullable: true, default: null, name: 'ldap_port' })
  ldapPort: number;

  @ApiProperty({ example: null, required: false, default: null })
  @Column({ nullable: true, default: null, name: 'ldap_base_dn' })
  ldapBaseDn: string;

  @ApiProperty({ example: null, required: false, default: null })
  @Column({ nullable: true, default: null, name: 'ldap_bind_on' })
  ladpBindDn: string;

  @ApiProperty({ example: null, required: false, default: null })
  @Column({ nullable: true, default: null, name: 'ldap_bind_password' })
  ldapBindPassword: string;

  @ApiProperty({ example: null, required: false, default: null })
  @Column({ nullable: true, default: null, name: 'ldap_group' })
  ldapGroup: string;

  @ApiProperty({ example: null, required: false, default: null })
  @Column({ nullable: true, default: null, name: 'ldap_user' })
  ldapUser: string;

  @ApiProperty({ example: 22 })
  @Column({ name: 'auto_query_hour_start' })
  autoQueryHourStart: number;

  @ApiProperty({ example: 0 })
  @Column({ name: 'auto_query_minute_start' })
  autoQueryMinuteStart: number;

  @ApiProperty({ example: 6 })
  @Column({ name: 'auto_query_hour_stop' })
  autoQueryHourStop: number;

  @ApiProperty({ example: 0 })
  @Column({ name: 'auto_query_minute_stop' })
  autoQueryMinuteStop: number;

  @ApiProperty({ example: false, required: false })
  @Column({ default: false, name: 'use_ldap' })
  useLdap: boolean;

  @ApiProperty({ example: 10, required: false })
  @Column({ default: 10, name: 'orthanc_monitoring_rate' })
  orthancMonitoringRate: number;

  @ApiProperty({ example: false, required: false })
  @Column({ default: false, name: 'burner_started' })
  burnerStarted: boolean;

  @ApiProperty({ example: '', required: false, default: '' })
  @Column({ default: '', name: 'burner_label_path' })
  burnerLabelPath: string;

  @ApiProperty({ example: 'Study', required: false, default: 'Study' })
  @Column({ default: 'Study', name: 'burner_monitoring_level' })
  burnerMonitoringLevel: string;

  @ApiProperty({ example: 'Epson', required: false, default: 'Epson' })
  @Column({ default: 'Epson', name: 'burner_manifacturer' })
  burnerManifacturer: string;

  @ApiProperty({ example: '', required: false, default: '' })
  @Column({ default: '', name: 'burner_monitored_path' })
  burnerMonitoredPath: string;

  @ApiProperty({ example: false, required: false, default: false })
  @Column({ default: false, name: 'burner_delete_study_after_sent' })
  burnerDeleteStudyAfterSent: boolean;

  @ApiProperty({ example: 'Auto', required: false, default: 'Auto' })
  @Column({ default: 'Auto', name: 'burner_support_type' })
  burnerSupportType: string;

  @ApiProperty({ example: '', required: false, default: '' })
  @Column({ default: '', name: 'burner_viewer_path' })
  burnerViewerPath: string;

  @ApiProperty({ example: 'None', required: false, default: 'None' })
  @Column({ default: 'None', name: 'burner_transfer_syntax' })
  burnerTransferSyntax: string;

  @ApiProperty({ example: 'uk', required: false, default: 'uk' })
  @Column({ default: 'uk', name: 'burner_date_format' })
  burnerDateFormat: string;

  @ApiProperty({ example: 'None', required: false, default: 'None' })
  @Column({ default: 'None', name: 'burner_transcoding' })
  burnerTranscoding: string;

  @ApiProperty({ example: false, required: false, default: false })
  @Column({ default: false, name: 'autorouter_started' })
  autorouterStarted: boolean;
}
