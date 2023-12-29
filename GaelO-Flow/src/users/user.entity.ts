import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { Role } from '../roles/role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    name: 'firstname',
  })
  firstname: string;

  @Column({
    name: 'lastname',
  })
  lastname: string;

  @Column({
    unique: true,
    name: 'username',
  })
  username: string;

  @Column({
    nullable: true,
    name: 'password',
  })
  password: string;

  @Column({
    unique: true,
    name: 'email',
  })
  email: string;

  @Column({
    default: false,
    name: 'super_admin',
  })
  superAdmin: boolean;

  @Column({ 
   name: 'role_name',
   unique: false,
   nullable: true,
  })
  roleName: string;

  //TODO: add lostPassword field timestamp

  @ManyToOne(() => Role, (role) => role.name)
  @JoinColumn({ name: 'role_name' })
  role?: Role;

  @Column({
    default: false,
    name: 'is_active',
  })
  isActive: boolean;

  @Column({
    name: 'salt',
    nullable: true,
  })
  salt: string;
}
