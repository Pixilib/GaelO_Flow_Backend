import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { RoleLabel } from '../role_label/role-label.entity';
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
    return await this.rolesRepository.findOneByOrFail({ Name: name });
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
    const role = await this.rolesRepository.findOneBy({ Name: roleName });
    const label = await this.labelsRepository.findOneBy({
      Name: labelName,
    });

    roleLabel.Role = role;
    roleLabel.Label = label;
    await this.roleLabelRepository.save(roleLabel);
  }

  async getAllRoleLabels(): Promise<RoleLabel[]> {
    return await this.roleLabelRepository.find();
  }

  async getRoleLabels(roleName: string): Promise<RoleLabel[]> {
    const allLabels = await this.roleLabelRepository.find({
      where: {
        Role: {
          Name: roleName,
        },
      },
    });
    return allLabels;
  }

  /* istanbul ignore next */
  public async seed() {
    const admin = this.rolesRepository.create({
      Name: 'Admin',
      Import: true,
      Anonymize: true,
      Export: true,
      Query: true,
      AutoQuery: true,
      Delete: true,
      Admin: true,
      Modify: true,
      CdBurner: true,
      AutoRouting: true,
    });

    const user = this.rolesRepository.create({
      Name: 'User',
      Import: true,
      Anonymize: true,
      Export: true,
      Query: true,
      AutoQuery: true,
      Delete: true,
      Admin: false,
      Modify: true,
      CdBurner: true,
      AutoRouting: true,
    });

    await this.rolesRepository.insert([admin, user]);
  }
}
