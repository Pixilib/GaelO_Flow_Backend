import { ApiProperty } from '@nestjs/swagger';
import { Label } from '../labels/label.entity';
import { Entity, Column, PrimaryColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Role {
  @ApiProperty({ example: 'admin' })
  @PrimaryColumn({ name: 'name' })
  Name: string;

  @ApiProperty({ example: true })
  @Column({ default: false, name: 'import' })
  Import: boolean;

  @ApiProperty({ example: true })
  @Column({ default: false, name: 'anonymize' })
  Anonymize: boolean;

  @ApiProperty({ example: true })
  @Column({ default: false, name: 'export' })
  Export: boolean;

  @ApiProperty({ example: true })
  @Column({ default: false, name: 'query' })
  Query: boolean;

  @ApiProperty({ example: true })
  @Column({ default: false, name: 'auto_query' })
  AutoQuery: boolean;

  @ApiProperty({ example: true })
  @Column({ default: false, name: 'delete' })
  Delete: boolean;

  @ApiProperty({ example: true })
  @Column({ default: false, name: 'admin' })
  Admin: boolean;

  @ApiProperty({ example: true })
  @Column({ default: false, name: 'modify' })
  Modify: boolean;

  @ApiProperty({ example: true })
  @Column({ default: false, name: 'cd_burner' })
  CdBurner: boolean;

  @ApiProperty({ example: true })
  @Column({ default: false, name: 'auto_routing' })
  AutoRouting: boolean;

  @ApiProperty({ example: [], required: false, default: [] })
  @ManyToMany(() => Label, (label) => label.Name)
  @JoinTable({ name: 'role_label' })
  Labels?: Label[];
}
