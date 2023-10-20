// options.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { OptionsService } from './options.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Option } from './option.entity';
import { Repository } from 'typeorm';

describe('OptionsService', () => {
  let optionsService: OptionsService;
  let optionsRepository: Repository<Option>;
  let option: Option;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Option],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Option]),
      ],
      providers: [OptionsService],
    }).compile();

    optionsService = module.get<OptionsService>(OptionsService);
    optionsRepository = module.get<Repository<Option>>(getRepositoryToken(Option));
    option = optionsRepository.create({
      auto_query_hour_start: 22,
      auto_query_minute_start: 0,
      auto_query_hour_stop: 24,
      auto_query_minute_stop: 0,
      use_ldap: false,
    });
    await optionsRepository.insert(option);
  });

  describe('getOptions', () => {
    it('should return the options', async () => {
      const result = await optionsService.getOptions();
      expect(result).toEqual(option);
    });
  });

  describe('update', () => {
    it('should update the options', async () => {
      const newOption = {...option, use_ldap: true};
      const result = await optionsService.update(newOption);
      const getOptions = await optionsService.getOptions();

      expect(getOptions).toEqual(newOption);
    });
  });
});
