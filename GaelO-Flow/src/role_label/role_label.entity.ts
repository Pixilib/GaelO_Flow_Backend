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
@Unique(['Role', 'Label'])
export class RoleLabel {
  @PrimaryGeneratedColumn()
  Id: number;

  @ManyToOne(() => Role, { eager: true })
  @JoinColumn({ name: 'role_name' })
  Role: Role;

  @ManyToOne(() => Label, { eager: true })
  @JoinColumn({ name: 'label_name' })
  Label: Label;
}
