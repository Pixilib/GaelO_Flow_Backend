import { Label } from 'src/labels/label.entity';
import { Role } from 'src/roles/role.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  ManyToMany,
  JoinColumn,
} from 'typeorm';

@Entity()
@Unique(['roleName', 'labelName'])
export class RoleLabel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'role_name',
    unique: false,
    nullable: true,
  })
  roleName: string;

  @ManyToMany(() => Role, (role) => role.name)
  @JoinColumn({ name: 'role_name' })
  role?: Role;

  @Column({
    name: 'label_name',
    unique: false,
    nullable: true,
  })
  labelName: string;

  @ManyToMany(() => Label, (label) => label.name)
  @JoinColumn({ name: 'label_name' })
  label?: Label;
}
