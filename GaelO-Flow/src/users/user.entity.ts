import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, OneToOne, JoinColumn} from 'typeorm';

import { Role } from '../roles/role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  userName: string;

  @Column()
  password:string;

  @Column()
  email: string;

  @Column({ default: false })
  superAdmin: boolean

  @OneToOne(type => Role) @JoinColumn()
  role: Role

  @Column({ default: true })
  isActive: boolean;
}