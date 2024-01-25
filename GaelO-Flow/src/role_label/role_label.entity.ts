import { Label } from '../labels/label.entity';
import { Role } from '../roles/role.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  ManyToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
@Unique(['role', 'label'])
export class RoleLabel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Role, { eager: true }) // Use eager loading to fetch the related Role
  @JoinColumn({ name: 'role_name' })
  role: Role;

  @ManyToOne(() => Label, { eager: true }) // Use eager loading to fetch the related Label
  @JoinColumn({ name: 'label_name' })
  label: Label;
}
