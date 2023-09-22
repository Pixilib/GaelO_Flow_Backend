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

  findAll(): Promise<Label[]> {
    return this.labelsRepository.find();
  }

  findOne(label_name: string): Promise<Label | null> {
    return this.labelsRepository.findOneBy({ label_name });
  }

  async remove(label_name: string): Promise<void> {
    await this.labelsRepository.delete(label_name);
  }

}
