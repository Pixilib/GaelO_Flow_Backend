import { Test } from '@nestjs/testing';
import { QueuesDeleteController } from './queueDeletes.controller';
import { QueuesDeleteService } from './queueDeletes.service';
import { QueuesDeleteDto } from './queueDeletes.dto';
import { ForbiddenException } from '@nestjs/common';

describe('QueuesDeleteController', () => {
  let controller: QueuesDeleteController;
  let service: QueuesDeleteService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [QueuesDeleteController],
      providers: [
        {
          provide: QueuesDeleteService,
          useValue: {
            addDeleteJob: jest.fn(),
            removeDeleteJob: jest.fn(),
            getJobs: jest.fn(),
            checkIfUserIdHasJobs: jest.fn(),
            getUuidOfUser: jest.fn(),
            closeQueueConnection: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<QueuesDeleteService>(QueuesDeleteService);
    controller = module.get<QueuesDeleteController>(QueuesDeleteController);
  });

  describe('addDeleteJob', () => {
    it('should return a UUID when a delete job is added', async () => {
      // MOCK
      const mockRequest: any = { user: { userId: 1 } };
      const dto: QueuesDeleteDto = {
        orthancSeriesIds: ['123', '456'],
      };
      jest.spyOn(service, 'checkIfUserIdHasJobs').mockResolvedValue(false);
      jest.spyOn(service, 'addDeleteJob').mockResolvedValue();

      // ACT
      const result = await controller.addDeleteJob(dto, mockRequest);

      // ASSERT
      expect(result).toHaveProperty('uuid');
      expect(service.checkIfUserIdHasJobs).toHaveBeenCalledWith(1);
      expect(service.checkIfUserIdHasJobs).toHaveBeenCalledTimes(1);
      expect(service.addDeleteJob).toHaveBeenCalledWith({
        uuid: expect.any(String),
        userId: 1,
        orthancSeriesId: '123',
        aborted: false,
      });
      expect(service.addDeleteJob).toHaveBeenCalledTimes(
        dto.orthancSeriesIds.length,
      );
    });

    it('should throw ForbiddenException if user already has jobs', async () => {
      // MOCK
      const mockRequest: any = { user: { userId: 1 } };
      const dto: QueuesDeleteDto = {
        orthancSeriesIds: ['123', '456'],
      };
      jest.spyOn(service, 'checkIfUserIdHasJobs').mockResolvedValue(true);

      // ACT & ASSERT
      await expect(controller.addDeleteJob(dto, mockRequest)).rejects.toThrow(
        ForbiddenException,
      );
      expect(service.checkIfUserIdHasJobs).toHaveBeenCalledWith(1);
      expect(service.checkIfUserIdHasJobs).toHaveBeenCalledTimes(1);
      expect(service.addDeleteJob).not.toHaveBeenCalled();
    });

    it('should call addDeleteJob for each orthancSeriesId', async () => {
      // MOCK
      const mockRequest: any = { user: { userId: 1 } };
      const dto: QueuesDeleteDto = {
        orthancSeriesIds: ['123', '456', '789'],
      };
      jest.spyOn(service, 'checkIfUserIdHasJobs').mockResolvedValue(false);
      jest.spyOn(service, 'addDeleteJob').mockResolvedValue();

      // ACT
      const result = await controller.addDeleteJob(dto, mockRequest);

      // ASSERT
      expect(result).toHaveProperty('uuid');
      expect(service.checkIfUserIdHasJobs).toHaveBeenCalledWith(1);
      expect(service.addDeleteJob).toHaveBeenCalledTimes(
        dto.orthancSeriesIds.length,
      );
      dto.orthancSeriesIds.forEach((id) => {
        expect(service.addDeleteJob).toHaveBeenCalledWith({
          uuid: expect.any(String),
          userId: 1,
          orthancSeriesId: id,
          aborted: false,
        });
      });
    });
  });

  describe('removeDeleteJob', () => {
    it('should call removeDeleteJob service method with the correct uuid', async () => {
      // MOCK
      const uuid = 'test-uuid';
      jest.spyOn(service, 'removeDeleteJob').mockResolvedValue();

      // ACT
      await controller.removeDeleteJob(uuid);

      // ASSERT
      expect(service.removeDeleteJob).toHaveBeenCalledWith({ uuid });
      expect(service.removeDeleteJob).toHaveBeenCalledTimes(1);
    });
  });

  describe('getJobsForUuid', () => {
    it('should return job progress details for a given UUID', async () => {
      // MOCK
      const uuid = 'test-uuid';
      const mockJobs: any = [
        {
          id: 'job1',
          name: 'job1',
          data: {
            uuid: uuid,
            orthancSeriesId: 'series1',
            state: 'waiting',
            userId: 1,
            aborted: false,
          },
          progress: 0,
        },
      ];
      jest.spyOn(service, 'getJobs').mockResolvedValue(mockJobs);

      // ACT
      const result = await controller.getJobsForUuid(uuid);

      // ASSERT
      expect(service.getJobs).toHaveBeenCalledWith(uuid);
      expect(service.getJobs).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        series1: {
          progress: 0,
          state: 'waiting',
          id: 'job1',
        },
      });
    });

    it('should return an empty array if no jobs are found for the UUID', async () => {
      // MOCK
      const uuid = 'test-uuid';
      jest.spyOn(service, 'getJobs').mockResolvedValue([]);

      // ACT
      const result = await controller.getJobsForUuid(uuid);

      // ASSERT
      expect(service.getJobs).toHaveBeenCalledWith(uuid);
      expect(result).toEqual({});
    });
  });

  describe('getUuidOfUser', () => {
    it('should return UUID for the given user', async () => {
      // MOCK
      const mockUserId = 'user123';
      const mockUuid = 'uuid123';
      const mockRequest: any = { user: { userId: mockUserId } };
      jest.spyOn(service, 'getUuidOfUser').mockResolvedValue(mockUuid);

      // ACT
      const result = await controller.getUuidOfUser(mockRequest);

      // ASSERT
      expect(service.getUuidOfUser).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual({ uuid: mockUuid });
    });

    it('should handle the case where no UUID is found for the user', async () => {
      // MOCK
      const mockUserId = 'user123';
      const mockRequest: any = { user: { userId: mockUserId } };
      jest.spyOn(service, 'getUuidOfUser').mockResolvedValue(null);

      // ACT
      const result = await controller.getUuidOfUser(mockRequest);

      // ASSERT
      expect(service.getUuidOfUser).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual({ uuid: null });
    });
  });
});
