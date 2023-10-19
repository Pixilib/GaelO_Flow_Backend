import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Label {
    @PrimaryColumn()
    label_name: string;
}
