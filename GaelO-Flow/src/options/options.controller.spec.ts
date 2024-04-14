import { Test, TestingModule } from '@nestjs/testing';
import { OptionsService } from './options.service';
import { OptionsController } from './options.controller';
import { Option } from './option.entity';
import { OptionDto } from './options.dto';
import { ConfigService } from '@nestjs/config';

describe('OptionsController', () => {
  let optionsController: OptionsController;
  let optionsService: OptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OptionsController],
      providers: [
        ConfigService,
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
    it('check if getOptions has adminGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        OptionsController.prototype.getOptions,
      );
      const guardNames = guards.map((guard: any) => guard.name);

      expect(guardNames.length).toBe(1);
      expect(guardNames).toContain('AdminGuard');
    });

    it('check if getOptions of the controller calls getOptions of the service', async () => {
      const mock = jest.spyOn(optionsService, 'getOptions').mockResolvedValue({
        Id: 1,
        AutoQueryHourStart: 22,
        AutoQueryMinuteStart: 0,
        AutoQueryHourStop: 6,
        AutoQueryMinuteStop: 0,
        OrthancMonitoringRate: 10,
        BurnerStarted: false,
        BurnerLabelPath: '',
        BurnerMonitoringLevel: 'Study',
        BurnerManifacturer: 'Epson',
        BurnerMonitoredPath: '',
        BurnerDeleteStudyAfterSent: false,
        BurnerSupportType: 'Auto',
        BurnerViewerPath: '',
        BurnerTransferSyntax: 'Auto',
        BurnerDateFormat: 'uk',
        BurnerTranscoding: 'None',
        AutorouterStarted: false,
      });

      const result = await optionsController.getOptions();
      expect(mock).toHaveBeenCalled();
      expect(result).toEqual({
        AutoQueryHourStart: 22,
        AutoQueryMinuteStart: 0,
        AutoQueryHourStop: 6,
        AutoQueryMinuteStop: 0,
        OrthancMonitoringRate: 10,
        BurnerStarted: false,
        BurnerLabelPath: '',
        BurnerMonitoringLevel: 'Study',
        BurnerManifacturer: 'Epson',
        BurnerMonitoredPath: '',
        BurnerDeleteStudyAfterSent: false,
        BurnerSupportType: 'Auto',
        BurnerViewerPath: '',
        BurnerTransferSyntax: 'Auto',
        BurnerDateFormat: 'uk',
        BurnerTranscoding: 'None',
        AutorouterStarted: false,
        OrthancAddress: undefined,
        OrthancPort: undefined,
        OrthancUsername: undefined,
        OrthancPassword: undefined,
        RedisAddress: undefined,
        RedisPort: undefined,
      });
    });
  });

  describe('update', () => {
    it('check if update has adminGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        OptionsController.prototype.update,
      );
      const guardNames = guards.map((guard: any) => guard.name);

      expect(guardNames.length).toBe(1);
      expect(guardNames).toContain('AdminGuard');
    });

    it('check if update of the controller calls update of the service', async () => {
      const mockUpdate = jest
        .spyOn(optionsService, 'update')
        .mockResolvedValue(undefined);

      await optionsController.update({ AutoQueryHourStart: 23 } as OptionDto);
      expect(mockUpdate).toHaveBeenCalled();
    });
  });
});
