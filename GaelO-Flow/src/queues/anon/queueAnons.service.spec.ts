import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { QueuesAnonService } from './queueAnons.service';

describe('QueuesQueryService', () => {
  let service: QueuesAnonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueuesAnonService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<QueuesAnonService>(QueuesAnonService);
  });

  afterEach(async () => {
    await service.closeQueueConnection();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
