import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Label {
  @ApiProperty({ example: 'name' })
  @PrimaryColumn({ name: 'name' })
  name: string;
}
