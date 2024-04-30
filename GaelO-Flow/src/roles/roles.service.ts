import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from './role.entity';
import { Label } from '../labels/label.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Label)
    private labelsRepository: Repository<Label>,
  ) {}

  async findAll(): Promise<Role[]> {
    return await this.rolesRepository.find();
  }

  async findAllWithLabels(): Promise<Role[]> {
    const allRoles = await this.rolesRepository.find({
      relations: ['Labels'],
    });
    return allRoles;
  }

  async findOneByOrFail(name: string): Promise<Role | null> {
    return await this.rolesRepository.findOneByOrFail({ Name: name });
  }

  async isRoleExist(name: string): Promise<boolean> {
    return (await this.rolesRepository.findOneBy({ Name: name })) != null;
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
    const role = await this.rolesRepository.findOneOrFail({
      where: { Name: roleName },
      relations: ['Labels'],
    });
    const label = await this.labelsRepository.findOneOrFail({
      where: { Name: labelName },
    });
    if (role.Labels.find((label) => label.Name == labelName))
      throw new ConflictException('Label already exists for role');

    role.Labels.push(label);
    await this.rolesRepository.save(role);
  }

  async getRoleLabels(roleName: string): Promise<Label[]> {
    const role = await this.rolesRepository.findOneOrFail({
      where: { Name: roleName },
      relations: ['Labels'],
    });
    return role.Labels;
  }

  async removeRoleLabel(roleName: string, labelName: string): Promise<void> {
    const role = await this.rolesRepository.findOneOrFail({
      where: { Name: roleName },
      relations: ['Labels'],
    });

    role.Labels = role.Labels.filter((label) => label.Name != labelName);
    await this.rolesRepository.save(role);
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
      ReadAll: true,
      Labels: [],
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
      ReadAll: true,
      Labels: [],
    });

    await this.rolesRepository.insert([admin, user]);
  }
}
