import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInstance, IsString, Matches } from 'class-validator';
import { ProcessingJobTypeEnum, ProcessingMaskEnum } from './processing.enum';

export class TmtvJobDto {
  @ApiProperty({ required: true })
  @IsString()
  CtOrthancSeriesId: string;

  @ApiProperty({ required: true })
  @IsString()
  PtOrthancSeriesId: string;

  @ApiProperty({ required: true })
  @IsString()
  @Matches(/^(seg|rtss)$/, {
    message: 'Invalid mask type, expected "seg" or "rtss"',
  })
  SendMaskToOrthancAs: ProcessingMaskEnum;

  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  WithFragmentedMask: boolean;
}

export class ProcessingJobDto {
  @ApiProperty({ required: true })
  @IsString()
  @Matches(/^(tmtv)$/, {
    message: 'Invalid job type, expected "tmtv"',
  }) // TODO: is instance of enum
  JobType: ProcessingJobTypeEnum;

  @ApiProperty({ required: false })
  @IsInstance(TmtvJobDto)
  TmtvJob: TmtvJobDto;
}
