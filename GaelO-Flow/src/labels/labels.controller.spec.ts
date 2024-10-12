import { Test, TestingModule } from '@nestjs/testing';
import { LabelsService } from './labels.service';
import { LabelsController } from './labels.controller';
import { LabelDto } from './labels.dto';
import { AdminGuard, ReadAllGuard } from 'src/guards/roles.guard';

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
            findAllRolesForLabel: jest.fn(),
          },
        },
      ],
    }).compile();

    labelsService = module.get<LabelsService>(LabelsService);
    labelsController = module.get<LabelsController>(LabelsController);
  });

  describe('findAll', () => {
    it('check if findAll labels has OrGuard admin or Readall', async () => {

      const guards = Reflect.getMetadata(
        '__guards__',
        LabelsController.prototype.findAll,
      );

      const orGuards = new guards[0]().__getGuards();
      expect(orGuards.length).toBe(2);
      expect(orGuards[0]).toBe(AdminGuard);
      expect(orGuards[1]).toBe(ReadAllGuard);
    });

    it('checks if findAll of the controller calls findAll of the service', async () => {
      const mock = jest.spyOn(labelsService, 'findAll').mockResolvedValue([]);

      await labelsController.findAll();
      expect(mock).toHaveBeenCalled();
    });
  });

  describe('findAllLAbelForRole', () => {
    it('check if findAllLAbelForRole has adminGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        LabelsController.prototype.findAllLAbelForRole,
      );
      const guardNames = guards.map((guard: any) => guard.name);

      expect(guardNames.length).toBe(1);
      expect(guardNames).toContain('AdminGuard');
    });

    it('checks if findAllLAbelForRole of the controller calls findAllRolesForLabel of the service', async () => {
      const mock = jest
        .spyOn(labelsService, 'findAllRolesForLabel')
        .mockResolvedValue([
          {
            Name: 'firstRole',
            Import: true,
            Export: true,
            Admin: true,
            Anonymize: true,
            AutoQuery: true,
            Query: true,
            Delete: true,
            Modify: true,
            CdBurner: true,
            AutoRouting: true,
            ReadAll: true,
          },
        ]);

      expect(await labelsController.findAllLAbelForRole('first')).toStrictEqual(
        ['firstRole'],
      );
      expect(mock).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('check if remove has adminGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        LabelsController.prototype.remove,
      );
      const guardNames = guards.map((guard: any) => guard.name);

      expect(guardNames.length).toBe(1);
      expect(guardNames).toContain('AdminGuard');
    });

    it('checks if remove of the controller calls remove of the service', async () => {
      const mockRemove = jest
        .spyOn(labelsService, 'remove')
        .mockResolvedValue(undefined);

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
    it('check if create has adminGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        LabelsController.prototype.create,
      );
      const guardNames = guards.map((guard: any) => guard.name);

      expect(guardNames.length).toBe(1);
      expect(guardNames).toContain('AdminGuard');
    });

    it('checks if create of the controller calls create of the service', async () => {
      const mockCreate = jest
        .spyOn(labelsService, 'create')
        .mockResolvedValue(undefined);

      await labelsController.create({ Name: 'first' } as LabelDto);

      expect(mockCreate).toHaveBeenCalled();
    });

    it('checks if create of the controller throws if the labels already exists', async () => {
      const mockCreate = jest
        .spyOn(labelsService, 'create')
        .mockResolvedValue(undefined);
      const mockIsLabelExist = jest
        .spyOn(labelsService, 'isLabelExist')
        .mockResolvedValue(true);

      expect(
        labelsController.create({ Name: 'first' } as LabelDto),
      ).rejects.toThrow();
      expect(mockIsLabelExist).toHaveBeenCalled();
    });
  });
});
