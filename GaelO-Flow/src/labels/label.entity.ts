import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Label {
  @PrimaryColumn({ name: 'label_name' })
  labelName: string;
}
