import { Test, TestingModule } from '@nestjs/testing';
import { OptionsService } from './options.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Option } from './option.entity';
import { Repository } from 'typeorm';
import { OptionsModule } from './options.module';

describe('OptionsService', () => {
  let optionsService: OptionsService;
  let optionsRepository: Repository<Option>;
  let option: Option;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        OptionsModule,
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
    optionsRepository = module.get<Repository<Option>>(
      getRepositoryToken(Option),
    );
    option = optionsRepository.create({
      AutoQueryHourStart: 22,
      AutoQueryMinuteStart: 0,
      AutoQueryHourStop: 24,
      AutoQueryMinuteStop: 0,
    });
    await optionsRepository.insert(option);
  });

  describe('getOptions', () => {
    it('should return the options', async () => {
      const result = await optionsService.getOptions();
      expect(result).toEqual(option);
    });
    /*
    it('check if update of the controller throws when it cannot get the options', async () => {
      expect(
        optionsService.update({ useLdap: true } as Option),
      ).rejects.toThrow(EntityNotFoundError);
    });
    */
  });

  describe('update', () => {
    it('should update the options', async () => {
      const newOption = { ...option, AutoQueryHourStart: 23 };
      await optionsService.update(newOption);
      const getOptions = await optionsService.getOptions();

      expect(getOptions).toEqual(newOption);
    });
  });
});
