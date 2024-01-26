import { Label } from '../labels/label.entity';
import { Role } from '../roles/role.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
@Unique(['role', 'label'])
export class RoleLabel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Role, { eager: true })
  @JoinColumn({ name: 'role_name' })
  role: Role;

  @ManyToOne(() => Label, { eager: true })
  @JoinColumn({ name: 'label_name' })
  label: Label;
}
