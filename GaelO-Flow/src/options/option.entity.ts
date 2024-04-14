import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Option {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ name: 'id' })
  @Exclude()
  Id: number;

  @ApiProperty({ example: 22 })
  @Column({ name: 'auto_query_hour_start' })
  AutoQueryHourStart: number;

  @ApiProperty({ example: 0 })
  @Column({ name: 'auto_query_minute_start' })
  AutoQueryMinuteStart: number;

  @ApiProperty({ example: 6 })
  @Column({ name: 'auto_query_hour_stop' })
  AutoQueryHourStop: number;

  @ApiProperty({ example: 0 })
  @Column({ name: 'auto_query_minute_stop' })
  AutoQueryMinuteStop: number;

  @ApiProperty({ example: 10, required: false })
  @Column({ default: 10, name: 'orthanc_monitoring_rate' })
  OrthancMonitoringRate: number;

  @ApiProperty({ example: false, required: false })
  @Column({ default: false, name: 'burner_started' })
  BurnerStarted: boolean;

  @ApiProperty({ example: '', required: false, default: '' })
  @Column({ default: '', name: 'burner_label_path' })
  BurnerLabelPath: string;

  @ApiProperty({ example: 'Study', required: false, default: 'Study' })
  @Column({ default: 'Study', name: 'burner_monitoring_level' })
  BurnerMonitoringLevel: string;

  @ApiProperty({ example: 'Epson', required: false, default: 'Epson' })
  @Column({ default: 'Epson', name: 'burner_manifacturer' })
  BurnerManifacturer: string;

  @ApiProperty({ example: '', required: false, default: '' })
  @Column({ default: '', name: 'burner_monitored_path' })
  BurnerMonitoredPath: string;

  @ApiProperty({ example: false, required: false, default: false })
  @Column({ default: false, name: 'burner_delete_study_after_sent' })
  BurnerDeleteStudyAfterSent: boolean;

  @ApiProperty({ example: 'Auto', required: false, default: 'Auto' })
  @Column({ default: 'Auto', name: 'burner_support_type' })
  BurnerSupportType: string;

  @ApiProperty({ example: '', required: false, default: '' })
  @Column({ default: '', name: 'burner_viewer_path' })
  BurnerViewerPath: string;

  @ApiProperty({ example: 'None', required: false, default: 'None' })
  @Column({ default: 'None', name: 'burner_transfer_syntax' })
  BurnerTransferSyntax: string;

  @ApiProperty({ example: 'uk', required: false, default: 'uk' })
  @Column({ default: 'uk', name: 'burner_date_format' })
  BurnerDateFormat: string;

  @ApiProperty({ example: 'None', required: false, default: 'None' })
  @Column({ default: 'None', name: 'burner_transcoding' })
  BurnerTranscoding: string;

  @ApiProperty({ example: false, required: false, default: false })
  @Column({ default: false, name: 'autorouter_started' })
  AutorouterStarted: boolean;
}
