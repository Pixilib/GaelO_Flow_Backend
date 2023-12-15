import { Test, TestingModule } from '@nestjs/testing';
import { TestremiService } from './testremi.service';

describe('TestremiService', () => {
  let service: TestremiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestremiService],
    }).compile();

    service = module.get<TestremiService>(TestremiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
