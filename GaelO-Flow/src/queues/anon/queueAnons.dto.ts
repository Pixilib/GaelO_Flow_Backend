import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsObject, IsString } from 'class-validator';

class QueuesAnonDto {
  @ApiProperty({ example: 'orthanc_study_id' })
  @IsString()
  orthancStudyID: string;

  @ApiProperty({ example: 'profile' })
  @IsString()
  profile: string;

  @ApiProperty({ example: 'new_accession_number' })
  @IsString()
  newAccessionNumber: string;

  @ApiProperty({ example: 'new_patient_id' })
  @IsString()
  newPatientID: string;

  @ApiProperty({ example: 'new_patient_name' })
  @IsString()
  newPatientName: string;

  @ApiProperty({ example: 'new_study_description' })
  @IsString()
  newStudyDescription: string;
}

export class QueuesAnonsDto {
  @ApiProperty({
    example: [QueuesAnonDto],
  })
  @IsArray()
  @IsObject({ each: true })
  anonymizes: QueuesAnonDto[];
}
