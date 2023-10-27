import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Label } from './label.entity';

@Injectable()
export class LabelsService {
  constructor(
    @InjectRepository(Label)
    private labelsRepository: Repository<Label>,
  ) {}

  async findAll(): Promise<Label[]> {
    return this.labelsRepository.find();
  }

  async findOneByOrFail(label_name: string): Promise<Label> {
    return await this.labelsRepository.findOneByOrFail({ label_name });
  }

  //TODO A TESTER
  async isLabelExist(label_name: string): Promise<boolean> {
    const answser = await this.labelsRepository.findOneBy({ label_name });
    return answser !== null;
  }

  async remove(label_name: string): Promise<void> {
    await this.labelsRepository.delete(label_name);
  }

  async create(label: Label): Promise<void> {
    await this.labelsRepository.save(label);
  }
}
