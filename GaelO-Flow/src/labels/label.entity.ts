import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Label {
  @ApiProperty({ example: 'label_name' })
  @PrimaryColumn({ name: 'label_name' })
  labelName: string;
}
