import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString, Matches } from 'class-validator';
import { ProcessingMaskEnum } from '../processingMask.enum';

export class NewProcessingJobDto {
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
