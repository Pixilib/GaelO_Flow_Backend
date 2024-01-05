import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Role {
  @ApiProperty({ example: 'admin' })
  @PrimaryColumn({ name: 'name' })
  name: string;

  @ApiProperty({ example: true })
  @Column({ default: false, name: 'import' })
  import: boolean;

  @ApiProperty({ example: true })
  @Column({ default: false, name: 'anonymize' })
  anonymize: boolean;

  @ApiProperty({ example: true })
  @Column({ default: false, name: 'export' })
  export: boolean;

  @ApiProperty({ example: true })
  @Column({ default: false, name: 'query' })
  query: boolean;

  @ApiProperty({ example: true })
  @Column({ default: false, name: 'auto_query' })
  autoQuery: boolean;

  @ApiProperty({ example: true })
  @Column({ default: false, name: 'delete' })
  delete: boolean;

  @ApiProperty({ example: true })
  @Column({ default: false, name: 'admin' })
  admin: boolean;

  @ApiProperty({ example: true })
  @Column({ default: false, name: 'modify' })
  modify: boolean;

  @ApiProperty({ example: true })
  @Column({ default: false, name: 'cd_burner' })
  cdBurner: boolean;

  @ApiProperty({ example: true })
  @Column({ default: false, name: 'auto_routing' })
  autoRouting: boolean;
}
