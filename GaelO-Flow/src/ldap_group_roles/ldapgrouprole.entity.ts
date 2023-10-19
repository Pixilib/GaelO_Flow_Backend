import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, Index } from 'typeorm';

import { Role } from '../roles/role.entity';

@Entity()
@Index(["ldap_group", "role_name"], { unique: true })
export class LdapGroupRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ldap_group: string;

  @OneToOne(type => Role) @JoinColumn()
  role_name: Role
}
