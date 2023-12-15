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
    optionsRepository = module.get<Repository<Option>>(
      getRepositoryToken(Option),
    );
    option = optionsRepository.create({
      autoQueryHourStart: 22,
      autoQueryMinuteStart: 0,
      autoQueryHourStop: 24,
      autoQueryMinuteStop: 0,
      useLdap: false,
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
      const newOption = { ...option, useLdap: true };
      await optionsService.update(newOption);
      const getOptions = await optionsService.getOptions();

      expect(getOptions).toEqual(newOption);
    });
  });
});
