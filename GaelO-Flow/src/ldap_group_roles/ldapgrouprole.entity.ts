import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, Index } from 'typeorm';

import { Role } from '../roles/role.entity';

@Entity()
@Index(["ldapGroup", "roleName"], { unique: true })
export class LdapGroupRole {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column( {name: 'ldap_group'})
  ldapGroup: string;

  @OneToOne(type => Role) @JoinColumn({ name: 'role_name'})
  roleName: Role
}
