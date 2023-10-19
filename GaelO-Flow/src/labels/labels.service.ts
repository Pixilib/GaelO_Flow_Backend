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

  async findOne(label_name: string): Promise<Label> {
    return await this.labelsRepository.findOneBy({ label_name });
  }

  async remove(label_name: string): Promise<void> {
    console.log(label_name);

    await this.labelsRepository.delete(label_name);
  }

  async create(label: Label): Promise<Label> {
    return this.labelsRepository.save(label);
  }

}
