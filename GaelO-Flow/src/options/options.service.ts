import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Option } from './option.entity';
import { UpdateOptionDto } from './options.dto';

@Injectable()
export class OptionsService {
  constructor(
    @InjectRepository(Option)
    private optionsRepository: Repository<Option>,
  ) {}

  async getOptions(): Promise<Option> {
    return await this.optionsRepository.findOneByOrFail({ id: 1 });
  }

  async update(option: UpdateOptionDto): Promise<void> {
    await this.optionsRepository.update(1, option);
  }

  public async seed() {
    const option = this.optionsRepository.create({
      autoQueryHourStart: 22,
      autoQueryMinuteStart: 0,
      autoQueryHourStop: 6,
      autoQueryMinuteStop: 0,
      useLdap: false,
    });
    await this.optionsRepository.insert(option);
  }
}
