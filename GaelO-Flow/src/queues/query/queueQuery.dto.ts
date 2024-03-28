import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsObject, IsString } from 'class-validator';

export class QueuesQueryStudyDto {
  @ApiProperty({ example: 'patient_name' })
  @IsString()
  PatientName: string;

  @ApiProperty({ example: 'patient_id' })
  @IsString()
  PatientID: string;

  @ApiProperty({ example: 'patient_birthdate' })
  @IsString()
  StudyDate: string;

  @ApiProperty({ example: 'modality' })
  @IsString()
  Modality: string;

  @ApiProperty({ example: 'study_description' })
  @IsString()
  StudyDescription: string;

  @ApiProperty({ example: 'accession_nb' })
  @IsString()
  AccessionNb: string;

  @ApiProperty({ example: 'study_instance_uid' })
  @IsString()
  StudyInstanceUID: string;

  @ApiProperty({ example: 'aet' })
  @IsString()
  Aet: string;
}

export class QueuesQuerySeriesDto {
  @ApiProperty({ example: 'study_uid' })
  @IsString()
  StudyUID: string;

  @ApiProperty({ example: 'modality' })
  @IsString()
  Modality: string;

  @ApiProperty({ example: 'protocol_name' })
  @IsString()
  ProtocolName: string;

  @ApiProperty({ example: 'series_description' })
  @IsString()
  SeriesDescription: string;

  @ApiProperty({ example: 'series_number' })
  @IsString()
  SeriesNumber: string;

  @ApiProperty({ example: 'series_instance_uid' })
  @IsString()
  SeriesInstanceUID: string;

  @ApiProperty({ example: 'aet' })
  @IsString()
  Aet: string;
}

export class QueuesQueryDto {
  @ApiProperty({
    example: [
      {
        PatientName: 'patient_name',
        PatientID: 'patient_id',
        StudyDate: 'patient_birthdate',
        Modality: 'modality',
        StudyDescription: 'study_description',
        AccessionNb: 'accession_nb',
        StudyInstanceUID: 'study_instance_uid',
        Aet: 'aet',
      },
    ],
    required: false,
  })
  @IsArray()
  @IsObject({ each: true })
  Studies: QueuesQueryStudyDto[] = [];

  @ApiProperty({
    example: [
      {
        StudyUID: 'study_uid',
        Modality: 'modality',
        ProtocolName: 'protocol_name',
        SeriesDescription: 'series_description',
        SeriesNumber: 'series_number',
        SeriesInstanceUID: 'series_instance_uid',
        Aet: 'aet',
      },
    ],
    required: false,
  })
  @IsArray()
  @IsObject({ each: true })
  Series: QueuesQuerySeriesDto[] = [];
}
