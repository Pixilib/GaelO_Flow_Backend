import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Label } from './label.entity';
import { Role } from '../roles/role.entity';

/**
 * Database access to label related data.
 */
@Injectable()
export class LabelsService {
  constructor(
    @InjectRepository(Label)
    private labelsRepository: Repository<Label>,
  ) {}

  async findAll(): Promise<Label[]> {
    return this.labelsRepository.find();
  }

  async findAllRolesForLabel(labelName: string): Promise<Role[]> {
    return (
      await this.labelsRepository.findOneOrFail({
        where: { Name: labelName },
        relations: ['Roles'],
      })
    ).Roles;
  }

  async findOneByOrFail(labelName: string): Promise<Label> {
    return await this.labelsRepository.findOneByOrFail({ Name: labelName });
  }

  async isLabelExist(labelName: string): Promise<boolean> {
    const answser = await this.labelsRepository.findOneBy({ Name: labelName });
    return answser !== null;
  }

  async remove(labelName: string): Promise<void> {
    await this.labelsRepository.delete(labelName);
  }

  async create(label: Label): Promise<void> {
    await this.labelsRepository.save(label);
  }
}
