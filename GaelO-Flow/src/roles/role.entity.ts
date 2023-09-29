import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Role {
  @PrimaryColumn()
  name: string;

  @Column({default: false})
  import: boolean;

  @Column({default: false})
  anonymize: boolean;

  @Column({default: false})
  export: boolean;

  @Column({default: false})
  query: boolean;

  @Column({default: false})
  auto_query: boolean;

  @Column({default: false})
  delete: boolean;

  @Column({default: false})
  admin: boolean;

  @Column({default: false})
  modify: boolean;

  @Column({default: false})
  cd_burner: boolean;

  @Column({default: false})
  auto_routing: boolean;
}
