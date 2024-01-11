import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { Role } from '../roles/role.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

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

  @Column({
    nullable: true,
    name: 'password',
  })
  @Exclude()
  password: string;

  @ApiProperty({ example: 'john.doe@gmail.com' })
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

  //TODO: add lostPassword field timestamp
  @ManyToOne(() => Role, (role) => role.name)
  @JoinColumn({ name: 'role_name' })
  role?: Role;

  @Column({
    name: 'salt',
    nullable: true,
    default: null,
  })
  @Exclude()
  salt?: string;
}
