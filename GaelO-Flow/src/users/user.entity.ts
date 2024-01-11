import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { Role } from '../roles/role.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id?: number;

  @ApiProperty({ example: 'John' })
  @Column({
    name: 'firstname',
  })
  firstname: string;

  @ApiProperty({ example: 'Doe' })
  @Column({
    name: 'lastname',
  })
  lastname: string;

  @ApiProperty({ example: 'johndoe' })
  @Column({
    unique: true,
    name: 'username',
  })
  username: string;

  @ApiProperty({ example: 'myPassw0rd' })
  @Column({
    nullable: true,
    name: 'password',
  })
  password: string;

  @ApiProperty({ example: 'john.doe@gmail.com'})
  @Column({
    unique: true,
    name: 'email',
  })
  email: string;

  @ApiProperty({ example: true })
  @Column({
    default: false,
    name: 'super_admin',
  })
  superAdmin: boolean;

  @ApiProperty({ example: 'admin' })
  @Column({
    name: 'role_name',
    unique: false,
    nullable: true,
  })
  roleName: string;


  @ApiProperty()
  @ManyToOne(() => Role, (role) => role.name)
  @JoinColumn({ name: 'role_name' })
  role?: Role;

  @ApiProperty({ example: true })
  @Column({
    name: 'salt',
    nullable: true,
  })
  salt: string;
}
