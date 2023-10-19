import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { Role } from '../roles/role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  super_admin: boolean;

  @Column({ name: 'role_name', unique: false})
  role_name: string;

  @ManyToOne(() => Role, role => role.name)
  @JoinColumn({ name: 'role_name' })
  role?: Role;

  @Column({ default: true })
  is_active: boolean;

  @Column()
  salt: string;
}
