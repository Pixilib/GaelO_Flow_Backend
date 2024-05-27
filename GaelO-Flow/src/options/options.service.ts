import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Option } from './option.entity';
import { UpdateOptionDto } from './dto/update-option.dto';
/**
 * Database access to options related data. The option table, contains only one record.
 */
@Injectable()
export class OptionsService {
  constructor(
    @InjectRepository(Option)
    private optionsRepository: Repository<Option>,
  ) {}

  async getOptions(): Promise<Option> {
    return await this.optionsRepository.findOneByOrFail({ Id: 1 });
  }

  async update(option: UpdateOptionDto): Promise<void> {
    await this.optionsRepository.update(1, option);
  }

  /* istanbul ignore next */
  public async seed() {
    const option = this.optionsRepository.create({
      AutoQueryHourStart: 22,
      AutoQueryMinuteStart: 0,
      AutoQueryHourStop: 6,
      AutoQueryMinuteStop: 0,
    });
    await this.optionsRepository.insert(option);
  }
}
