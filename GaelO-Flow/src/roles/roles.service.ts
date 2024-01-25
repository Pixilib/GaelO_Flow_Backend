import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { RoleLabel } from '../role_label/role_label.entity';
import { Label } from '../labels/label.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Label)
    private labelsRepository: Repository<Label>,
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
    const role = await this.rolesRepository.findOneBy({ name: roleName });
    const label = await this.labelsRepository.findOneBy({
      name: labelName,
    });

    if (role == null || label == null)
      throw new BadRequestException('Role or Label not found');

    roleLabel.role = role;
    roleLabel.label = label;

    await this.roleLabelRepository.save(roleLabel);
  }

  async getAllRoleLabels(): Promise<RoleLabel[]> {
    console.log('getAllRoleLabels');
    return await this.roleLabelRepository.find();
  }

  async getRoleLabels(roleName: string): Promise<RoleLabel[]> {
    const allLabels = await this.roleLabelRepository.find({
      where: {
        role: {
          name: roleName,
        },
      },
    });
    return allLabels;
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
