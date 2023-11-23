import { IsArray } from 'class-validator';
export class QueuesDeleteDto {
  @IsArray()
  orthancSeriesIds: string[];
}
