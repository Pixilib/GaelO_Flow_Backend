import { Test } from '@nestjs/testing';
import { Queue } from 'bullmq';

import { AbstractQueueService } from './queue.service';

class QueuesTestService extends AbstractQueueService {
  constructor(queue: Queue) {
    super(queue);
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
      obliterate: jest.fn(),
    } as any;

    await Test.createTestingModule({
      imports: [],
      providers: [QueuesTestService, { provide: Queue, useValue: mockQueue }],
    }).compile();

    service = new QueuesTestService(mockQueue);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addJob', () => {
    it('should correctly add a job to the queue', async () => {
      // MOCK
      const testData = {
        uuid: '123',
        orthancSeriesId: '456',
        userId: 1,
        state: 'wait',
      };
      const mockAdd = jest.spyOn(mockQueue, 'add');

      // ACT
      await service.addJob(testData);

      // ASSERT
      expect(mockAdd).toHaveBeenCalledWith('123', testData, {
        removeOnComplete: { age: 3600 },
        removeOnFail: { age: 86400 },
      });
    });
  });

  describe('getJobs', () => {
    beforeEach(() => {
      jest
        .spyOn(mockQueue, 'getJobs')
        .mockReturnValueOnce([
          { data: { uuid: 'uuid1' } },
          { data: { uuid: 'uuid2' } },
        ] as any)
        .mockReturnValueOnce([
          { data: { uuid: 'uuid1' } },
          { data: { uuid: 'uuid2' } },
        ] as any)
        .mockReturnValue([] as any);
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
      expect(jobs.length).toBe(4);
    });
  });

  describe('removeJob', () => {
    beforeEach(() => {
      jest.spyOn(mockQueue, 'getJobs').mockReturnValue([
        { id: 'job1', data: { uuid: 'uuid1', userId: 1, jobId: 'job1' } },
        { id: 'job2', data: { uuid: 'uuid1', userId: 2, jobId: 'job2' } },
        { id: 'job3', data: { uuid: 'uuid2', userId: 2, jobId: 'job3' } },
      ] as any);
    });

    it('should remove jobs with a specific uuid', async () => {
      // MOCK
      const mockRemove = jest.spyOn(mockQueue, 'remove');

      // ACT
      await service.removeJob({ uuid: 'uuid1' });

      // ASSERT
      expect(mockRemove).toHaveBeenCalledTimes(2);
      expect(mockRemove.mock.calls).toEqual([
        ['job1', { removeChildren: true }],
        ['job2', { removeChildren: true }],
      ]);
    });

    it('should remove jobs with a specific userId', async () => {
      // MOCK
      const mockRemove = jest.spyOn(mockQueue, 'remove');

      // ACT
      await service.removeJob({ userId: 2 });

      // ASSERT
      expect(mockRemove).toHaveBeenCalledTimes(2);
      expect(mockRemove.mock.calls).toEqual([
        ['job2', { removeChildren: true }],
        ['job3', { removeChildren: true }],
      ]);
    });

    it('should remove jobs with a specific jobId', async () => {
      // MOCK
      const mockRemove = jest.spyOn(mockQueue, 'remove');

      // ACT
      await service.removeJob({ jobId: 'job2' });

      // ASSERT
      expect(mockRemove).toHaveBeenCalledTimes(1);
      expect(mockRemove).toHaveBeenCalledWith('job2', { removeChildren: true });
    });

    it('should remove all jobs when data is undefined', async () => {
      // MOCK
      const mockRemove = jest.spyOn(mockQueue, 'remove');

      // ACT
      await service.removeJob();

      // ASSERT
      expect(mockRemove).toHaveBeenCalledTimes(3);
      expect(mockRemove.mock.calls).toEqual([
        ['job1', { removeChildren: true }],
        ['job2', { removeChildren: true }],
        ['job3', { removeChildren: true }],
      ]);
    });
  });

  describe('checkIfUserIdHasJobs', () => {
    beforeEach(() => {
      jest.spyOn(mockQueue, 'getJobs').mockReturnValue([
        { id: 'job1', data: { uuid: 'uuid1', userId: 1, jobId: 'job1' } },
        { id: 'job2', data: { uuid: 'uuid1', userId: 2, jobId: 'job2' } },
        { id: 'job3', data: { uuid: 'uuid2', userId: 2, jobId: 'job3' } },
      ] as any);
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
    beforeEach(() => {
      jest.spyOn(mockQueue, 'getJobs').mockReturnValue([
        { id: 'job1', data: { uuid: 'uuid1', userId: 1, jobId: 'job1' } },
        { id: 'job2', data: { uuid: 'uuid1', userId: 2, jobId: 'job2' } },
        { id: 'job3', data: { uuid: 'uuid2', userId: 2, jobId: 'job3' } },
      ] as any);
    });

    it('should return the uuid for a given userId', async () => {
      const uuid = await service.getUuidOfUser(2);
      expect(['uuid1', 'uuid2']).toContain(uuid);
    });

    it('should return null if there are no jobs for the given userId', async () => {
      const uuid = await service.getUuidOfUser(3);
      expect(uuid).toBeNull();
    });
  });

  describe('flush', () => {
    it('should flush the queue', async () => {
      // MOCK
      const mockObliterate = jest.spyOn(mockQueue, 'obliterate');

      // ACT
      await service.flush();

      // ASSERT
      expect(mockObliterate).toHaveBeenCalledTimes(1);
      expect(mockObliterate).toHaveBeenCalledWith({ force: true });
    });
  });

  describe('getJobsForUuid', () => {
    beforeEach(() => {
      jest
        .spyOn(mockQueue, 'getJobs')
        .mockReturnValueOnce([
          {
            progress: 0,
            id: 'job1',
            data: { uuid: 'uuid1', userId: 1, jobId: 'job1' },
          },
          {
            progress: 0,
            id: 'job2',
            data: { uuid: 'uuid1', userId: 2, jobId: 'job2' },
          },
          {
            progress: 0,
            id: 'job3',
            data: { uuid: 'uuid2', userId: 2, jobId: 'job3' },
          },
        ] as any)
        .mockReturnValueOnce([
          {
            progress: 0,
            id: 'job4',
            data: { uuid: 'uuid1', userId: 1, jobId: 'job4' },
          },
          {
            progress: 0,
            id: 'job5',
            data: { uuid: 'uuid2', userId: 2, jobId: 'job5' },
          },
        ] as any)
        .mockReturnValueOnce([
          {
            progress: 0,
            id: 'job6',
            data: { uuid: 'uuid1', userId: 1, jobId: 'job6' },
          },
        ] as any)
        .mockReturnValue([] as any);
    });

    it('should return the jobs for a given uuid', async () => {
      const jobs = await service.getJobsForUuid('uuid1');
      expect(jobs).toStrictEqual({
        job1: {
          Progress: 0,
          State: 'completed',
          Id: 'job1',
          Results: undefined,
          UserId: 1,
        },
        job2: {
          Progress: 0,
          State: 'completed',
          Id: 'job2',
          Results: undefined,
          UserId: 2,
        },
        job4: {
          Progress: 0,
          State: 'failed',
          Id: 'job4',
          Results: undefined,
          UserId: 1,
        },
        job6: {
          Progress: 0,
          State: 'delayed',
          Id: 'job6',
          Results: undefined,
          UserId: 1,
        },
      });
    });

    it('should return all jobs if no uuid is provided', async () => {
      const jobs = await service.getJobsForUuid();
      expect(jobs).toStrictEqual({
        job1: {
          Progress: 0,
          State: 'completed',
          Id: 'job1',
          Results: undefined,
          UserId: 1,
        },
        job2: {
          Progress: 0,
          State: 'completed',
          Id: 'job2',
          Results: undefined,
          UserId: 2,
        },
        job3: {
          Progress: 0,
          State: 'completed',
          Id: 'job3',
          Results: undefined,
          UserId: 2,
        },
        job4: {
          Progress: 0,
          State: 'failed',
          Id: 'job4',
          Results: undefined,
          UserId: 1,
        },
        job5: {
          Progress: 0,
          State: 'failed',
          Id: 'job5',
          Results: undefined,
          UserId: 2,
        },
        job6: {
          Progress: 0,
          State: 'delayed',
          Id: 'job6',
          Results: undefined,
          UserId: 1,
        },
      });
    });
  });
});
