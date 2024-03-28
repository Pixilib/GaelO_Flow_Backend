import { Test, TestingModule } from '@nestjs/testing';
import { Queue } from 'bullmq';
import { BullModule, InjectQueue } from '@nestjs/bullmq';
import { AbstractQueueService } from './queue.service';

class QueuesTestService extends AbstractQueueService {
  constructor(@InjectQueue('test') testQueue: Queue) {
    super(testQueue);
  }
}

describe('QueuesService', () => {
  let service: QueuesTestService;
  let mockQueue: jest.Mocked<Queue>;

  beforeEach(async () => {
    mockQueue = {
      add: jest.fn(),
      getJobs: jest.fn(),
      remove: jest.fn(),
      getJob: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        BullModule.forRoot({
          connection: {
            host: 'localhost', // REDIS_ADDRESS
            port: 6379, // REDIS_PORT
          },
        }),
        BullModule.registerQueue({
          name: 'test',
        }),
      ],
      providers: [
        QueuesTestService,
        {
          provide: 'BULLMQ_QUEUE_DELETE',
          useValue: mockQueue,
        },
      ],
    }).compile();

    service = module.get<QueuesTestService>(QueuesTestService);
  });

  afterEach(async () => {
    await service.closeQueueConnection();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addJob', () => {
    afterEach(async () => {
      // Clean up the queue after each test
      const jobs = await service.getJobs();
      await Promise.all(jobs.map((job) => job.remove()));
    });

    it('should correctly add a job to the queue', async () => {
      const testData = {
        uuid: '123',
        orthancSeriesId: '456',
        userId: 1,
        state: 'wait',
      };
      await service.addJob(testData);

      const jobs = await service.getJobs();
      const addedJob = jobs.find(
        (job) =>
          job.data.uuid === '123' &&
          job.data.orthancSeriesId === '456' &&
          job.data.userId === 1,
      );

      expect(addedJob).toBeDefined();
      expect(addedJob.data).toEqual(testData);
    });
  });

  describe('removeJob', () => {
    beforeEach(async () => {
      // Insert jobs with known properties
      await service.addJob({
        uuid: 'uuid1',
        orthancSeriesId: '123',
        userId: 1,
      });
      await service.addJob({
        uuid: 'uuid1',
        orthancSeriesId: '456',
        userId: 1,
      });
      await service.addJob({
        uuid: 'uuid2',
        orthancSeriesId: '789',
        userId: 2,
      });
    });

    afterEach(async () => {
      // Clean up the queue after each test
      const jobs = await service.getJobs();
      await Promise.all(jobs.map((job) => job.remove()));
    });

    it('should remove jobs with a specific uuid', async () => {
      await service.removeJob({ uuid: 'uuid1' });

      const remainingJobs = await service.getJobs();
      expect(remainingJobs.length).toBe(1);
      expect(remainingJobs[0].data.uuid).toBe('uuid2');
    });

    it('should remove all jobs when no data is provided', async () => {
      await service.removeJob();

      const remainingJobs = await service.getJobs();
      expect(remainingJobs.length).toBe(0);
    });
  });

  describe('getJobs', () => {
    beforeEach(async () => {
      // Insert jobs
      await service.addJob({
        uuid: 'uuid1',
        orthancSeriesId: '123',
        userId: 1,
      });
      await service.addJob({
        uuid: 'uuid1',
        orthancSeriesId: '456',
        userId: 1,
      });
      await service.addJob({
        uuid: 'uuid2',
        orthancSeriesId: '789',
        userId: 2,
      });
    });

    afterEach(async () => {
      // Clean up the queue after each test
      const jobs = await service.getJobs();
      await Promise.all(jobs.map((job) => job.remove()));
    });

    it('should retrieve jobs with a specific uuid', async () => {
      const jobs = await service.getJobs('uuid1');
      expect(jobs.length).toBe(2);
      jobs.forEach((job) => {
        expect(job.data.uuid).toBe('uuid1');
      });
    });

    it('should retrieve all jobs when uuid is undefined', async () => {
      const jobs = await service.getJobs();
      expect(jobs.length).toBe(3);
    });
  });

  describe('checkIfUserIdHasJobs', () => {
    beforeEach(async () => {
      // Insert jobs
      await service.addJob({
        uuid: 'uuid1',
        orthancSeriesId: '123',
        userId: 1,
      });
      await service.addJob({
        uuid: 'uuid1',
        orthancSeriesId: '456',
        userId: 1,
      });
      await service.addJob({
        uuid: 'uuid2',
        orthancSeriesId: '789',
        userId: 2,
      });
    });

    afterEach(async () => {
      // Clean up the queue after each test
      const jobs = await service.getJobs();
      await Promise.all(jobs.map((job) => job.remove()));
    });

    it('should return true if there are jobs for the given userId', async () => {
      const result = await service.checkIfUserIdHasJobs(1);
      expect(result).toBe(true);
    });

    it('should return false if there are no jobs for the given userId', async () => {
      const result = await service.checkIfUserIdHasJobs(3);
      expect(result).toBe(false);
    });
  });

  describe('getUuidOfUser', () => {
    beforeEach(async () => {
      // Insert jobs
      await service.addJob({ uuid: 'uuid1', userId: 1, data: 'data1' });
      await service.addJob({ uuid: 'uuid2', userId: 2, data: 'data2' });
      await service.addJob({ uuid: 'uuid3', userId: 1, data: 'data3' });
    });

    afterEach(async () => {
      // Clean up the queue after each test
      const jobs = await service.getJobs();
      await Promise.all(jobs.map((job) => job.remove()));
    });

    it('should return the uuid for a given userId', async () => {
      const uuid = await service.getUuidOfUser(1);
      expect(['uuid1', 'uuid3']).toContain(uuid);
    });

    it('should return null if there are no jobs for the given userId', async () => {
      const uuid = await service.getUuidOfUser(3);
      expect(uuid).toBeNull();
    });
  });

  describe('closeQueueConnection', () => {
    it('should close the queue connection', async () => {
      await service.closeQueueConnection();

      try {
        await service.getJobs();
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Connection is closed.');
      }
    });
  });

  describe('flush', () => {
    beforeEach(async () => {
      // Insert jobs
      await service.addJob({
        uuid: 'uuid1',
        orthancSeriesId: '123',
        userId: 1,
      });
      await service.addJob({
        uuid: 'uuid1',
        orthancSeriesId: '456',
        userId: 1,
      });
      await service.addJob({
        uuid: 'uuid2',
        orthancSeriesId: '789',
        userId: 2,
      });
    });

    afterEach(async () => {
      // Clean up the queue after each test
      const jobs = await service.getJobs();
      await Promise.all(jobs.map((job) => job.remove()));
    });

    it('should flush the queue', async () => {
      await service.flush();
      const jobs = await service.getJobs();
      expect(jobs.length).toBe(0);
    });
  });

  describe('getJobsForUuid', () => {
    beforeEach(async () => {
      // Insert jobs
      await service.addJob({
        uuid: 'uuid1',
        orthancSeriesId: '123',
        userId: 1,
      });
      await service.addJob({
        uuid: 'uuid1',
        orthancSeriesId: '456',
        userId: 1,
      });
      await service.addJob({
        uuid: 'uuid2',
        orthancSeriesId: '789',
        userId: 2,
      });
    });

    afterEach(async () => {
      await service.flush();
    });

    it('should return the jobs for a given uuid', async () => {
      const jobs = await service.getJobsForUuid('uuid1');
      expect(jobs).toStrictEqual({
        '1': {
          Progress: 0,
          State: 'wait',
          Id: '1',
          Results: undefined,
          UserId: 1,
        },
        '2': {
          Progress: 0,
          State: 'wait',
          Id: '2',
          Results: undefined,
          UserId: 1,
        },
      });
    });

    it('should return all jobs if no uuid is provided', async () => {
      const jobs = await service.getJobsForUuid();
      expect(jobs).toStrictEqual({
        '1': {
          Progress: 0,
          State: 'wait',
          Id: '1',
          Results: undefined,
          UserId: 1,
        },
        '2': {
          Progress: 0,
          State: 'wait',
          Id: '2',
          Results: undefined,
          UserId: 1,
        },
        '3': {
          Progress: 0,
          State: 'wait',
          Id: '3',
          Results: undefined,
          UserId: 2,
        },
      });
    });
  });
});
