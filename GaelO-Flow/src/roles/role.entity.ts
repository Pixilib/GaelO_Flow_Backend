import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Role {
  @PrimaryColumn({ name: 'name' })
  name: string;

  @Column({default: false, name: 'import'})
  import: boolean;

  @Column({default: false, name: 'anonymize'})
  anonymize: boolean;

  @Column({default: false, name: 'export' })
  export: boolean;

  @Column({default: false, name: 'query'})
  query: boolean;

  @Column({default: false, name: 'auto_query'})
  autoQuery: boolean;

  @Column({default: false, name: 'delete'})
  delete: boolean;

  @Column({default: false, name: 'admin'})
  admin: boolean;

  @Column({default: false, name: 'modify'})
  modify: boolean;

  @Column({default: false, name: 'cd_burner'})
  cdBurner: boolean;

  @Column({default: false, name: 'auto_routing'})
  autoRouting: boolean;
}
