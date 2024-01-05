import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsObject, IsString } from 'class-validator';

export class QueuesQueryStudyDto {
  @ApiProperty({ example: 'patient_name' })
  @IsString()
  patientName: string;

  @ApiProperty({ example: 'patient_id' })
  @IsString()
  patientID: string;

  @ApiProperty({ example: 'patient_birthdate' })
  @IsString()
  studyDate: string;

  @ApiProperty({ example: 'modality' })
  @IsString()
  modality: string;

  @ApiProperty({ example: 'study_description' })
  @IsString()
  studyDescription: string;

  @ApiProperty({ example: 'accession_nb' })
  @IsString()
  accessionNb: string;

  @ApiProperty({ example: 'study_instance_uid' })
  @IsString()
  studyInstanceUID: string;

  @ApiProperty({ example: 'aet' })
  @IsString()
  aet: string;
}

export class QueuesQuerySeriesDto {
  @ApiProperty({ example: 'study_uid' })
  @IsString()
  studyUID: string;

  @ApiProperty({ example: 'modality' })
  @IsString()
  modality: string;

  @ApiProperty({ example: 'protocol_name' })
  @IsString()
  protocolName: string;

  @ApiProperty({ example: 'series_description' })
  @IsString()
  seriesDescription: string;

  @ApiProperty({ example: 'series_number' })
  @IsString()
  seriesNumber: string;

  @ApiProperty({ example: 'series_instance_uid' })
  @IsString()
  seriesInstanceUID: string;

  @ApiProperty({ example: 'aet' })
  @IsString()
  aet: string;
}

export class QueuesQueryDto {
  @ApiProperty({ example: [QueuesQueryStudyDto], required: false })
  @IsArray()
  @IsObject({ each: true })
  studies: QueuesQueryStudyDto[] = [];

  @ApiProperty({ example: [QueuesQuerySeriesDto], required: false })
  @IsArray()
  @IsObject({ each: true })
  series: QueuesQuerySeriesDto[] = [];
}
