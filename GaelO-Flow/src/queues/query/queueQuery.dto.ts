import { IsArray, IsObject, IsString } from 'class-validator';

export class QueuesQueryStudyDto {
  @IsString()
  patientName: string;

  @IsString()
  patientID: string;

  @IsString()
  studyDate: string;

  @IsString()
  modality: string;

  @IsString()
  studyDescription: string;

  @IsString()
  accessionNb: string;

  @IsString()
  studyInstanceUID: string;

  @IsString()
  aet: string;
}

export class QueuesQuerySeriesDto {
  @IsString()
  studyUID: string;

  @IsString()
  modality: string;

  @IsString()
  protocolName: string;

  @IsString()
  seriesDescription: string;

  @IsString()
  seriesNumber: string;

  @IsString()
  seriesInstanceUID: string;

  @IsString()
  aet: string;
}

export class QueuesQueryDto {
  @IsArray()
  @IsObject({ each: true })
  studies: QueuesQueryStudyDto[] = [];

  @IsArray()
  @IsObject({ each: true })
  series: QueuesQuerySeriesDto[] = [];
}
