import { Test, TestingModule } from '@nestjs/testing';
import { TestremiController } from './testremi.controller';

describe('TestremiController', () => {
  let controller: TestremiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestremiController],
    }).compile();

    controller = module.get<TestremiController>(TestremiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
