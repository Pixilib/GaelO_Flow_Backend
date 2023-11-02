import { Test, TestingModule } from '@nestjs/testing';
import { LabelsService } from './labels.service';
import { LabelsController } from './labels.controller';
import { Label } from './label.entity';
import { LabelDto } from './labels.dto';

describe('LabelsController', () => {
  let labelsController: LabelsController;
  let labelsService: LabelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LabelsController],
      providers: [
        {
          provide: LabelsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
            create: jest.fn(),
            findOneByOrFail: jest.fn(),
            isLabelExist: jest.fn(),
          },
        },
      ],
    }).compile();

    labelsService = module.get<LabelsService>(LabelsService);
    labelsController = module.get<LabelsController>(LabelsController);
  });

  describe('findAll', () => {
    it('checks if findAll of the controller calls findAll of the service', async () => {
      const mock = jest.spyOn(labelsService, 'findAll').mockResolvedValue([]);

      await labelsController.findAll();
      expect(mock).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('checks if remove of the controller calls remove of the service', async () => {
      const mockRemove = jest
        .spyOn(labelsService, 'remove')
        .mockResolvedValue(undefined);
      const mockFindOne = jest
        .spyOn(labelsService, 'findOneByOrFail')
        .mockResolvedValue({ label_name: 'first' } as Label);

      await labelsController.remove('first');
      expect(mockRemove).toHaveBeenCalled();
    });

    it('checks if remove of the controller throws if the labels does not exist', async () => {
      const mockRemove = jest
        .spyOn(labelsService, 'remove')
        .mockResolvedValue(undefined);
      const mockFindOne = jest
        .spyOn(labelsService, 'findOneByOrFail')
        .mockResolvedValue(null);

      await labelsController.remove('first');
      expect(mockRemove).toHaveBeenCalled();
      expect(mockFindOne).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('checks if create of the controller calls create of the service', async () => {
      const mockCreate = jest
        .spyOn(labelsService, 'create')
        .mockResolvedValue(undefined);

      await labelsController.create({ label_name: 'first' } as LabelDto);

      expect(mockCreate).toHaveBeenCalled();
    });
  });
});
