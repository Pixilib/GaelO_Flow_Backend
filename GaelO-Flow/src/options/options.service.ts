import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Option } from './option.entity';

@Injectable()
export class OptionsService {
  constructor(
    @InjectRepository(Option)
    private optionsRepository: Repository<Option>,
  ) {}

  findAll(): Promise<Option[]> {
    return this.optionsRepository.find();
  }

  findOne(id: number): Promise<Option | null> {
    return this.optionsRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.optionsRepository.delete(id);
  }

  public async seed() {
    const option = this.optionsRepository.create({
      hour_start: 22,
      minute_start: 0,
      hour_stop: 24,
      minute_stop: 0,
      ldap: false,
    });

    await this.optionsRepository.insert([option]);
  }
}
