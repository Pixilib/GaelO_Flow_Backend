import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Option {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true})
  ldap_type: string;

  @Column({ nullable: true})
  ldap_protocol: string;

  @Column({ nullable: true})
  ldap_server: string;

  @Column({ nullable: true})
  ldap_port: number;

  @Column({ nullable: true})
  ldap_base_dn: string;

  @Column({ nullable: true})
  ladp_bind_dn: string;

  @Column({ nullable: true})
  ldap_bind_password: string;

  @Column({ nullable: true})
  ldap_group: string;

  @Column({ nullable: true})
  ldap_user: string;

  @Column()
  auto_query_hour_start: number;

  @Column()
  auto_query_minute_start: number;

  @Column()
  auto_query_hour_stop: number;

  @Column()
  auto_query_minute_stop: number;

  @Column({ default: false })
  use_ldap: boolean;

  @Column({ default: 10 })
  orthanc_monitoring_rate: number;

  @Column({ default: false })
  burner_started: boolean;

  @Column({ default: '' })
  burner_label_path: string;

  @Column({ default: 'Study' })
  burner_monitoring_level: string;

  @Column({ default: 'Epson' })
  burner_manifacturer: string;

  @Column({ default: '' })
  burner_monitored_path: string;

  @Column({ default: false })
  burner_delete_study_after_sent: boolean;

  @Column({ default: 'Auto' })
  burner_support_type: string;

  @Column({ default: '' })
  burner_viewer_path: string;

  @Column({ default: 'None' })
  burner_transfer_syntax: string;

  @Column({ default: 'uk' })
  burner_date_format: string;

  @Column({ default: 'None' })
  burner_transcoding: string;

  @Column({ default: false })
  autorouter_started: boolean;
}
