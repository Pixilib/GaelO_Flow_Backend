import { Test, TestingModule } from '@nestjs/testing';
import { ProcessingController } from './processing.controller';
import { ProcessingQueueService } from './processing-queue.service';
import exp from 'constants';
import { BadRequestException } from '@nestjs/common';
import { ProcessingJobDto } from './processing-job.dto';
import { ProcessingJobType, ProcessingMask } from '../constants/enums';

describe('ProcessingController', () => {
  let processingController: ProcessingController;
  let processingQueueService: ProcessingQueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProcessingController],
      providers: [
        {
          provide: ProcessingQueueService,
          useValue: {
            flush: jest.fn(),
            removeJob: jest.fn(),
            addJob: jest.fn(),
            getJobs: jest.fn(),
            getAllUuids: jest.fn(),
            getUuidsOfUser: jest.fn(),
          },
        },
      ],
    }).compile();

    processingController =
      module.get<ProcessingController>(ProcessingController);
    processingQueueService = module.get<ProcessingQueueService>(
      ProcessingQueueService,
    );
  });

  describe('flush', () => {
    it('Check that flushQueue is adminGuarded', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        ProcessingController.prototype.flushQueue,
      );
      const guardNames = guards.map((guard: any) => guard.name);

      expect(guardNames.length).toBe(1);
      expect(guardNames).toContain('AdminGuard');
    });

    it('should call processingQueueService flush', async () => {
      await processingController.flushQueue();
      expect(processingQueueService.flush).toHaveBeenCalled();
    });
  });

  describe('getUuid', () => {
    it('Check that getUuid is guarded with OrGuard, and that orGuard has AdminGuard and CheckUserId', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        ProcessingController.prototype.getUuid,
      );
      const guardNames = guards[0].guards.map(
        (guard: any) => guard.constructor.name,
      );

      expect(guards.length).toBe(1);
      expect(guards[0].constructor.name).toBe('OrGuard');
      expect(guardNames.length).toBe(2);
      expect(guardNames).toContain('AdminGuard');
      expect(guardNames).toContain('CheckUserIdGuard');
    });

    it('should call processingQueueService getAllUuids if no userId is provided and user is admin', async () => {
      // MOCK
      const request = { user: { role: { Admin: true } } };
      const mockUuids = ['uuid1', 'uuid2'];
      jest
        .spyOn(processingQueueService, 'getAllUuids')
        .mockResolvedValueOnce(mockUuids);

      // ACT
      const result = await processingController.getUuid(null, request as any);

      // ASSERT
      expect(processingQueueService.getAllUuids).toHaveBeenCalled();
      expect(result).toBe(mockUuids);
    });

    it('should call processingQueueService getUuidsOfUser if userId is provided', async () => {
      // MOCK
      const request = { user: { role: { Admin: false, userId: 1 } } };
      const mockUuids = ['uuid1', 'uuid2'];
      jest
        .spyOn(processingQueueService, 'getUuidsOfUser')
        .mockResolvedValueOnce(mockUuids);

      // ACT
      const result = await processingController.getUuid(1, request as any);

      // ASSERT
      expect(processingQueueService.getUuidsOfUser).toHaveBeenCalledWith(1);
      expect(result).toBe(mockUuids);
    });
  });

  describe('getJobs', () => {
    it('should throw BadRequestException if uuid is not provided', async () => {
      // MOCK
      const request = { user: { userId: 1 } };

      // ACT & ASSERT
      expect(
        processingController.getJobs(null, request as any),
      ).rejects.toThrow(BadRequestException);
    });

    it("should call processingQueueService getJobs with the uuid if the user is not an admin and the uuid belongs to the user's job", async () => {
      // MOCK
      const request = {
        user: {
          userId: 1,
          role: {
            Admin: false,
          },
        },
      };
      jest
        .spyOn(processingQueueService, 'getUuidsOfUser')
        .mockResolvedValue(['uuid1', 'uuid2']);
      jest
        .spyOn(processingQueueService, 'getJobs')
        .mockResolvedValue([
          { id: 'uuid1', progress: 0, data: { state: 'completed' } },
        ] as any);

      // ACT
      const result = await processingController.getJobs(
        'uuid1',
        request as any,
      );

      // ASSERT
      expect(processingQueueService.getUuidsOfUser).toHaveBeenCalledWith(1);
      expect(processingQueueService.getJobs).toHaveBeenCalledWith(
        undefined,
        'uuid1',
      );
      expect(result).toEqual([
        { Progress: 0, State: 'completed', Id: 'uuid1', Results: undefined },
      ]);
    });

    it('should call processingQueueService getJobs with the uuid if the user is an admin', async () => {
      // MOCK
      const request = {
        user: {
          userId: 1,
          role: {
            Admin: true,
          },
        },
      };
      jest
        .spyOn(processingQueueService, 'getJobs')
        .mockResolvedValue([
          { id: 'uuid1', progress: 0, data: { state: 'completed' } },
        ] as any);

      // ACT
      const result = await processingController.getJobs(
        'uuid1',
        request as any,
      );

      // ASSERT
      expect(processingQueueService.getJobs).toHaveBeenCalledWith(
        undefined,
        'uuid1',
      );
      expect(result).toEqual([
        { Progress: 0, State: 'completed', Id: 'uuid1', Results: undefined },
      ]);
    });

    it('should throw ForbiddenException if the user is not an admin and the uuid does not belong to the user', async () => {
      // MOCK
      const request = {
        user: {
          userId: 1,
          role: {
            Admin: false,
          },
        },
      };
      jest
        .spyOn(processingQueueService, 'getUuidsOfUser')
        .mockResolvedValue(['uuid2']);

      // ACT & ASSERT
      expect(
        processingController.getJobs('uuid1', request as any),
      ).rejects.toThrow("You don't have access to this resource");
    });
  });

  describe('addJob', () => {
    it('should call processingQueueService addJob', async () => {
      // MOCK
      const request = { user: { userId: 1 } };
      const processingJobDto: ProcessingJobDto = {
        JobType: ProcessingJobType.TMTV,
        TmtvJob: {
          CtOrthancSeriesId: 'CtOrthancSeriesId',
          PtOrthancSeriesId: 'PtOrthancSeriesId',
          SendMaskToOrthancAs: ProcessingMask.SEG,
          WithFragmentedMask: false,
        },
      };
      const mockJobId = 'jobId';
      jest
        .spyOn(processingQueueService, 'addJob')
        .mockResolvedValueOnce(mockJobId);

      // ACT
      const result = await processingController.addJob(
        request as any,
        processingJobDto,
      );

      // ASSERT
      expect(processingQueueService.addJob).toHaveBeenCalled();
      expect(result).toStrictEqual({ JobId: mockJobId });
    });
  });

  describe('removeJob', () => {
    it('should call processingQueueService removeJob with the uuid', async () => {
      // MOCK
      const uuid = 'uuid1';
      const mockRemoveJob = jest
        .spyOn(processingQueueService, 'removeJob')
        .mockResolvedValueOnce();

      // ACT
      await processingController.removeJob(uuid);

      // ASSERT
      expect(mockRemoveJob).toHaveBeenCalledWith(uuid);
    });
  });
});
