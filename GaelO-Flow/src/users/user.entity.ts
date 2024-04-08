import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { Role } from '../roles/role.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'id' })
  Id?: number;

  @ApiProperty({ example: 'John', required: true })
  @Column({
    name: 'firstname',
  })
  Firstname: string;

  @ApiProperty({ example: 'Doe', required: true })
  @Column({
    name: 'lastname',
  })
  Lastname: string;

  @ApiProperty({ example: 'johndoe', required: true })
  @Column({
    unique: true,
    name: 'username',
  })
  Username: string;

  @Column({
    nullable: true,
    name: 'password',
  })
  @Exclude()
  Password: string;

  @ApiProperty({ example: 'john.doe@gmail.com', required: true })
  @Column({
    unique: true,
    name: 'email',
  })
  @IsEmail()
  Email: string;

  @ApiProperty({ example: true, required: true })
  @Column({
    default: false,
    name: 'super_admin',
  })
  SuperAdmin: boolean;

  @ApiProperty({ example: 'admin', required: true })
  @Column({
    name: 'role_name',
    unique: false,
    nullable: true,
  })
  RoleName: string;

  @ApiProperty()
  @ManyToOne(() => Role, (role) => role.Name)
  @JoinColumn({ name: 'role_name' })
  Role?: Role;
}
