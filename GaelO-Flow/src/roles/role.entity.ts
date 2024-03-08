import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn } from 'typeorm';

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
}
