// labels.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { LabelsService } from './labels.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Label } from './label.entity';
import { Repository } from 'typeorm';

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

    labels = [{ label_name: 'first' }, { label_name: 'second' }];

    await labelsRepository.insert(labels);
  });

  describe('findAll', () => {
    it('should return the labels', async () => {
      const result = await labelsService.findAll();

      expect(result).toEqual(labels);
    });
  });

  describe('findOne', () => {
    it('should get one label', async () => {
      const result = await labelsService.findOne('first');

      expect(result).toEqual({ label_name: 'first' });
    });

    it("should return null if labels doesn't exists", async () => {
      const result = await labelsService.findOne('third');

      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove one label', async () => {
      await labelsService.remove('first');
      const result = await labelsService.findAll();

      expect(result).toEqual([{ label_name: 'second' }]);
    });
  });

  describe('create', () => {
    it('should create a new label', async () => {
      const newLabel: Label = { label_name: 'third' };

      await labelsService.create(newLabel);
      const result = await labelsService.findAll();

      expect(result).toEqual([
        { label_name: 'first' },
        { label_name: 'second' },
        { label_name: 'third' },
      ]);
    });
  });
});
