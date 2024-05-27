import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../roles/role.entity';
import { Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class Label {
  @ApiProperty({ example: 'name' })
  @PrimaryColumn({ name: 'name' })
  Name: string;

  @ApiProperty({ example: [], required: false, default: [] })
  @ManyToMany(() => Role, (role) => role.Labels)
  Roles?: Role[];
}
