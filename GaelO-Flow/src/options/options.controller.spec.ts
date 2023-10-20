import { Test, TestingModule } from '@nestjs/testing';
import { OptionsService } from './options.service';
import { OptionsController } from './options.controller';
import { Option } from './option.entity';
import { OptionDto } from './options.dto';

import { NotFoundException } from '@nestjs/common';

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
            update: jest.fn()
          },
        }
      ],
    }).compile();

    optionsService = module.get<OptionsService>(OptionsService);
    optionsController = module.get<OptionsController>(OptionsController);
  });

  describe('getOptions', () => {
    it('check if getOptions of the controller calls getOptions of the service', async () => {
      const mock = jest.spyOn(optionsService, 'getOptions').mockResolvedValue({id: 1} as Option);

      await optionsController.getOptions();
      expect(mock).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('check if update of the controller calls update of the service', async () => {
      const mockUpdate = jest.spyOn(optionsService, 'update').mockResolvedValue(undefined);
      const mockGetOptions = jest.spyOn(optionsService, 'getOptions').mockResolvedValue({} as Option)

      await optionsController.update({use_ldap: true} as OptionDto);
      const result = await optionsController.getOptions();
      expect(mockUpdate).toHaveBeenCalled();
      expect(result).toEqual({use_ldap: true})
    });

    it('check if update of the controller throws when it cannot get the options', async () => {
      const mockUpdate = jest.spyOn(optionsService, 'update').mockResolvedValue(undefined);
      const mockGetOptions = jest.spyOn(optionsService, 'getOptions').mockResolvedValue(null);

      try {
        await optionsController.update({use_ldap: true} as OptionDto);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException)
      }
    });
  });

});
