import { Test, TestingModule } from '@nestjs/testing';
import { QueuesQueryService } from './queueQuery.service';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';

describe('QueuesQueryService', () => {
  let service: QueuesQueryService;
  let mockQueue: jest.Mocked<Queue>;

  beforeEach(async () => {
    mockQueue = {
      pause: jest.fn(),
      resume: jest.fn(),
      isPaused: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueuesQueryService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: 'BULLMQ_QUEUE_QUERY',
          useValue: mockQueue,
        },
      ],
    }).compile();

    service = module.get<QueuesQueryService>(QueuesQueryService);
  });

  afterEach(async () => {
    await service.closeQueueConnection();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('pause', () => {
    it('should pause the queue', async () => {
      await service.pause();
      expect(await service.isPaused()).toBe(true);
    });
  });

  describe('resume', () => {
    it('should resume the queue', async () => {
      await service.resume();
      expect(await service.isPaused()).toBe(false);
    });
  });
});
