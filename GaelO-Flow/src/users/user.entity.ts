import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import { Role } from '../roles/role.entity';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'id' })
  Id?: number;

  @ApiProperty({ example: 'John' })
  @Column({
    name: 'firstname',
  })
  Firstname: string;

  @ApiProperty({ example: 'Doe' })
  @Column({
    name: 'lastname',
  })
  Lastname: string;

  @Column({
    nullable: true,
    name: 'password',
  })
  @Exclude()
  Password: string;

  @ApiProperty({ example: 'john.doe@gmail.com' })
  @Column({
    unique: true,
    name: 'email',
  })
  Email: string;

  @ApiProperty({ example: 'admin' })
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

  @ApiProperty()
  @Column({
    nullable: true,
  })
  Token?: string;

  @ApiProperty()
  @Column({
    nullable: true,
  })
  TokenExpiration?: Date;
}
