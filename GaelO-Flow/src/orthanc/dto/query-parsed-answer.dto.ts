import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsObject, IsString } from 'class-validator';
import { QueryAnswerType } from '../../constants/enums';

export class QuerySeriesDto {
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
}

export class QueryStudyDto {
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
}

export class QueryParsedAnswerDto {
  @ApiProperty({ example: QueryAnswerType.LEVEL_SERIES, enum: QueryAnswerType })
  @IsEnum(QueryAnswerType)
  Level: QueryAnswerType;

  @ApiProperty()
  @IsObject()
  Query: QuerySeriesDto | QueryStudyDto;
}
