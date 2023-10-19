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

  getOptions(): Promise<Option> {
    return this.optionsRepository.findOneBy({ id: 1 });
  }

  async update(option: Option): Promise<void> {
    await this.optionsRepository.update(1, option);
  }

  public async seed() {
    const option = this.optionsRepository.create({
      auto_query_hour_start: 22,
      auto_query_minute_start: 0,
      auto_query_hour_stop: 24,
      auto_query_minute_stop: 0,
      use_ldap: false,
    });

    await this.optionsRepository.insert([option]);
  }
}
