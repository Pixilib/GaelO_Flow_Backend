import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Option {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  hour_start: number;

  @Column()
  minute_start: number;

  @Column()
  hour_stop: number;

  @Column()
  minute_stop: number;

  @Column({ default: false })
  ldap: boolean;

  @Column({ default: 10 })
  monitoring_rate: number;

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
