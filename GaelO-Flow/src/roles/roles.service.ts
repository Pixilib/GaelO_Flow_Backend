import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { RoleLabel } from 'src/role_label/role_label.entity';
import { Label } from 'src/labels/label.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(RoleLabel)
    private roleLabelRepository: Repository<RoleLabel>,
  ) {}

  async findAll(): Promise<Role[]> {
    return await this.rolesRepository.find();
  }

  async findOne(name: string): Promise<Role | null> {
    return await this.rolesRepository.findOneByOrFail({ name });
  }

  async create(role: Role): Promise<void> {
    await this.rolesRepository.save(role);
  }

  async remove(name: string): Promise<void> {
    await this.rolesRepository.delete(name);
  }

  async update(name: string, role: Role): Promise<void> {
    await this.rolesRepository.update(name, role);
  }

  async addRoleLabel(roleName: string, labelName: string): Promise<void> {
    const roleLabel = new RoleLabel();
    const role = new Role();
    const label = new Label();

    role.name = roleName;
    label.name = labelName;

    roleLabel.role = role;
    roleLabel.label = label;

    console.log('roleLabel', roleLabel);
    console.log('role', role);

    await this.roleLabelRepository.save(roleLabel);
  }

  async getAllRoleLabels(): Promise<RoleLabel[]> {
    console.log('getAllRoleLabels');
    return await this.roleLabelRepository.find();
  }

  async getRoleLabels(roleName: string): Promise<RoleLabel[]> {
    return await this.roleLabelRepository.find({ where: { roleName } });
  }

  public async seed() {
    const admin = this.rolesRepository.create({
      name: 'Admin',
      import: true,
      anonymize: true,
      export: true,
      query: true,
      autoQuery: true,
      delete: true,
      admin: true,
      modify: true,
      cdBurner: true,
      autoRouting: true,
    });

    const user = this.rolesRepository.create({
      name: 'User',
      import: true,
      anonymize: true,
      export: true,
      query: true,
      autoQuery: true,
      delete: true,
      admin: false,
      modify: true,
      cdBurner: true,
      autoRouting: true,
    });

    await this.rolesRepository.insert([admin, user]);
  }
}
