import { Test, TestingModule } from '@nestjs/testing';
import { OptionsService } from './options.service';
import { OptionsController } from './options.controller';
import { Option } from './option.entity';
import { OptionDto } from './options.dto';

describe('OptionsController', () => {
  let optionsController: OptionsController;
  let optionsService: OptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OptionsController],
      providers: [
        {
          provide: OptionsService,
          useValue: {
            getOptions: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    optionsService = module.get<OptionsService>(OptionsService);
    optionsController = module.get<OptionsController>(OptionsController);
  });

  describe('getOptions', () => {
    it('check if getOptions of the controller calls getOptions of the service', async () => {
      const mock = jest
        .spyOn(optionsService, 'getOptions')
        .mockResolvedValue({ id: 1 } as Option);

      await optionsController.getOptions();
      expect(mock).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('check if update of the controller calls update of the service', async () => {
      const mockUpdate = jest
        .spyOn(optionsService, 'update')
        .mockResolvedValue(undefined);

      await optionsController.update({ use_ldap: true } as OptionDto);
      expect(mockUpdate).toHaveBeenCalled();
    });
  });
});
