import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, OneToOne, JoinColumn} from 'typeorm';

import { Role } from '../roles/role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password:string;

  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  super_admin: boolean

  @OneToOne(type => Role) @JoinColumn()
  role: Role

  @Column({ default: true })
  is_active: boolean;
}