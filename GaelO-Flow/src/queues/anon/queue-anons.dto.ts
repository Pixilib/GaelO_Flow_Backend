import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsObject, IsString } from 'class-validator';

class QueuesAnonDto {
  @ApiProperty({ example: 'orthanc_study_id' })
  @IsString()
  OrthancStudyID: string;

  @ApiProperty({ example: 'profile' })
  @IsString()
  Profile: 'Default'|'Full';

  @ApiProperty({ example: 'new_accession_number' })
  @IsString()
  NewAccessionNumber: string;

  @ApiProperty({ example: 'new_patient_id' })
  @IsString()
  NewPatientID: string;

  @ApiProperty({ example: 'new_patient_name' })
  @IsString()
  NewPatientName: string;

  @ApiProperty({ example: 'new_study_description' })
  @IsString()
  NewStudyDescription: string;
}

export class QueuesAnonsDto {
  @ApiProperty({
    example: [QueuesAnonDto],
  })
  @IsArray()
  @IsObject({ each: true })
  Anonymizes: QueuesAnonDto[];
}
