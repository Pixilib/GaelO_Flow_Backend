import { IsArray, IsObject, IsString } from 'class-validator';

class QueuesAnonDto {
  @IsString()
  orthancStudyID: string;

  @IsString()
  profile: string;

  @IsString()
  newAccessionNumber: string;

  @IsString()
  newPatientID: string;

  @IsString()
  newPatientName: string;

  @IsString()
  newStudyDescription: string;
}

export class QueuesAnonsDto {
  @IsArray()
  @IsObject({ each: true })
  anonymizes: QueuesAnonDto[];
}
