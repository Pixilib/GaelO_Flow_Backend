import { Test, TestingModule } from '@nestjs/testing';
import { LabelsService } from './labels.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Label } from './label.entity';
import { EntityNotFoundError, Repository } from 'typeorm';

describe('LabelsService', () => {
  let labelsService: LabelsService;
  let labelsRepository: Repository<Label>;
  let labels: Label[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Label],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Label]),
      ],
      providers: [LabelsService],
    }).compile();

    labelsService = module.get<LabelsService>(LabelsService);
    labelsRepository = module.get<Repository<Label>>(getRepositoryToken(Label));
    labels = [{ labelName: 'first' }, { labelName: 'second' }];
    await labelsRepository.insert(labels);
  });

  describe('find all labels', () => {
    it('should return the labels', async () => {
      const result = await labelsService.findAll();
      expect(result).toEqual(labels);
    });
  });

  describe('find one label', () => {
    it('should get one label', async () => {
      const result = await labelsService.findOneByOrFail('first');
      expect(result).toEqual({ labelName: 'first' });
    });

    it("should throw if labels doesn't exists", async () => {
      expect(labelsService.findOneByOrFail('third')).rejects.toThrow(
        EntityNotFoundError,
      );
    });
  });

  describe('remove label', () => {
    it('should remove one label', async () => {
      await labelsService.remove('first');
      const result = await labelsService.findAll();
      expect(result).toEqual([{ labelName: 'second' }]);
    });
  });

  describe('create label', () => {
    it('should create a new label', async () => {
      const newLabel: Label = { labelName: 'third' };
      await labelsService.create(newLabel);
      const result = await labelsService.findAll();
      expect(result).toEqual([
        { labelName: 'first' },
        { labelName: 'second' },
        { labelName: 'third' },
      ]);
    });
  });

  describe('check if label exists', () => {
    it('should return true because label exists', async () => {
      const result = await labelsService.isLabelExist('first');
      expect(result).toEqual(true);
    });

    it('should return false because label does not exist', async () => {
      const result = await labelsService.isLabelExist('non existant');
      expect(result).toEqual(false);
    });
  });
});
