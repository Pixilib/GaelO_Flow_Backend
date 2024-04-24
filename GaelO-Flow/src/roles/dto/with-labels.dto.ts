import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class WithLabels {
  @IsOptional()
  @ApiProperty({ example: true })
  @Transform(
    ({ value }) => {
      return value === 'true' || value === '';
    },
    { toClassOnly: true },
  )
  @IsBoolean()
  WithLabels: boolean = false;
}
