import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { QueuesDeleteService } from './queueDeletes.service';

describe('QueuesQueryService', () => {
  let service: QueuesDeleteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueuesDeleteService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<QueuesDeleteService>(QueuesDeleteService);
  });

  afterEach(async () => {
    await service.closeQueueConnection();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
