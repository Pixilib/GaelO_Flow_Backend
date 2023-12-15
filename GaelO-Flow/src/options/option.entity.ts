import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Option {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ nullable: true, default: null, name: 'ldap_type' })
  ldapType: string;

  @Column({ nullable: true, default: null, name: 'ldap_protocol' })
  ldapProtocol: string;

  @Column({ nullable: true, default: null, name: 'ldap_server' })
  ldapServer: string;

  @Column({ nullable: true, default: null, name: 'ldap_port' })
  ldapPort: number;

  @Column({ nullable: true, default: null, name: 'ldap_base_dn' })
  ldapBaseDn: string;

  @Column({ nullable: true, default: null, name: 'ldap_bind_on' })
  ladpBindDn: string;

  @Column({ nullable: true, default: null, name: 'ldap_bind_password' })
  ldapBindPassword: string;

  @Column({ nullable: true, default: null, name: 'ldap_group' })
  ldapGroup: string;

  @Column({ nullable: true, default: null, name: 'ldap_user' })
  ldapUser: string;

  @Column({ name: 'auto_query_hour_start' })
  autoQueryHourStart: number;

  @Column({ name: 'auto_query_minute_start' })
  autoQueryMinuteStart: number;

  @Column({ name: 'auto_query_hour_stop' })
  autoQueryHourStop: number;

  @Column({ name: 'auto_query_minute_stop' })
  autoQueryMinuteStop: number;

  @Column({ default: false, name: 'use_ldap' })
  useLdap: boolean;

  @Column({ default: 10, name: 'orthanc_monitoring_rate' })
  orthancMonitoringRate: number;

  @Column({ default: false, name: 'burner_started' })
  burnerStarted: boolean;

  @Column({ default: '', name: 'burner_label_path' })
  burnerLabelPath: string;

  @Column({ default: 'Study', name: 'burner_monitoring_level' })
  burnerMonitoringLevel: string;

  @Column({ default: 'Epson', name: 'burner_manifacturer' })
  burnerManifacturer: string;

  @Column({ default: '', name: 'burner_monitored_path' })
  burnerMonitoredPath: string;

  @Column({ default: false, name: 'burner_delete_study_after_sent' })
  burnerDeleteStudyAfterSent: boolean;

  @Column({ default: 'Auto', name: 'burner_support_type' })
  burnerSupportType: string;

  @Column({ default: '', name: 'burner_viewer_path' })
  burnerViewerPath: string;

  @Column({ default: 'None', name: 'burner_transfer_syntax' })
  burnerTransferSyntax: string;

  @Column({ default: 'uk', name: 'burner_date_format' })
  burnerDateFormat: string;

  @Column({ default: 'None', name: 'burner_transcoding' })
  burnerTranscoding: string;

  @Column({ default: false, name: 'autorouter_started' })
  autorouterStarted: boolean;
}
