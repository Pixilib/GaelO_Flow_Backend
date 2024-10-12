import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsObject, IsString } from 'class-validator';
import { ProcessingJobType, ProcessingMask } from '../constants/enums';

export class TmtvJobDto {
  @ApiProperty({ required: true })
  @IsString()
  CtOrthancSeriesId: string;

  @ApiProperty({ required: true })
  @IsString()
  PtOrthancSeriesId: string;

  @ApiProperty({ required: true })
  @IsEnum(ProcessingMask)
  SendMaskToOrthancAs: ProcessingMask[];

  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  WithFragmentedMask: boolean;
}

export class ProcessingJobDto {
  @ApiProperty({ required: true, enum: ProcessingJobType })
  @IsEnum(ProcessingJobType)
  JobType: ProcessingJobType;

  @ApiProperty({ required: false })
  @IsObject()
  Payload: TmtvJobDto;
}
