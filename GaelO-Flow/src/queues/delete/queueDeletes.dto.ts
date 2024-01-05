import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
export class QueuesDeleteDto {
  @ApiProperty({ example: ['series_id_1', 'series_id_2'] })
  @IsArray()
  orthancSeriesIds: string[];
}
