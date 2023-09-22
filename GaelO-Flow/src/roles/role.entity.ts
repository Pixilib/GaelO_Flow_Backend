import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Role {
  @PrimaryColumn()
  name: string;

  @Column()
  import: boolean;

  @Column()
  anonymize: boolean;

  @Column()
  export: boolean;

  @Column()
  query: boolean;

  @Column()
  auto_query: boolean;

  @Column()
  delete: boolean;

  @Column()
  admin: boolean;

  @Column()
  modify: boolean;

  @Column()
  cd_burner: boolean;

  @Column()
  auto_routing: boolean;
}
