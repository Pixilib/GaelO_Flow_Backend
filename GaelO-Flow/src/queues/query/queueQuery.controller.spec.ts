import { Test } from '@nestjs/testing';
import { QueuesQueryController } from './queueQuery.controller';
import { QueuesQueryService } from './queueQuery.service';
import { QueuesQueryDto } from './queueQuery.dto';
import { ForbiddenException } from '@nestjs/common';

describe('QueuesQueryController', () => {
  let controller: QueuesQueryController;
  let service: QueuesQueryService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [QueuesQueryController],
      providers: [
        {
          provide: QueuesQueryService,
          useValue: {
            addJob: jest.fn(),
            removeJob: jest.fn(),
            getJobs: jest.fn(),
            checkIfUserIdHasJobs: jest.fn(),
            getUuidOfUser: jest.fn(),
            closeQueueConnection: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<QueuesQueryService>(QueuesQueryService);
    controller = module.get<QueuesQueryController>(QueuesQueryController);
  });

  describe('getAllJobs', () => {
    it('should return all jobs', async () => {
      // MOCK
      const uuid = 'test-uuid';
      const mockJobs: any = [
        {
          id: 'job1',
          name: 'job1',
          data: {
            uuid: uuid,
            state: 'waiting',
            userId: 1,
          },
          progress: 0,
        },
        {
          id: 'job2',
          name: 'job2',
          data: {
            uuid: uuid,
            state: 'waiting',
            userId: 1,
          },
          progress: 0,
        },
      ];
      jest.spyOn(service, 'checkIfUserIdHasJobs').mockResolvedValue(false);
      jest.spyOn(service, 'getJobs').mockResolvedValue(mockJobs);

      // ACT
      const result = await controller.getAllJobs();

      // ASSERT
      expect(service.getJobs).toHaveBeenCalledWith();
      expect(service.getJobs).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        ['job1']: {
          progress: 0,
          state: 'waiting',
          id: 'job1',
        },
        ['job2']: {
          progress: 0,
          state: 'waiting',
          id: 'job2',
        }, 
      })
    });
  });

  // describe('addQueryJob', () => {
  //   it('should return a UUID when a delete job is added', async () => {
  //     // MOCK
  //     const mockRequest: any = { user: { userId: 1 } };
  //     const dto: QueuesQueryDto = {
  //       orthancSeriesIds: ['123', '456'],
  //     };
  //     jest.spyOn(service, 'checkIfUserIdHasJobs').mockResolvedValue(false);
  //     jest.spyOn(service, 'addJob').mockResolvedValue();

  //     // ACT
  //     const result = await controller.addQueryJob(dto, mockRequest);

  //     // ASSERT
  //     expect(result).toHaveProperty('uuid');
  //     expect(service.checkIfUserIdHasJobs).toHaveBeenCalledWith(1);
  //     expect(service.checkIfUserIdHasJobs).toHaveBeenCalledTimes(1);
  //     expect(service.addJob).toHaveBeenCalledWith({
  //       uuid: expect.any(String),
  //       userId: 1,
  //       orthancSeriesId: '123',
  //     });
  //     expect(service.addJob).toHaveBeenCalledTimes(
  //       dto.orthancSeriesIds.length,
  //     );
  //   });

  //   it('should throw ForbiddenException if user already has jobs', async () => {
  //     // MOCK
  //     const mockRequest: any = { user: { userId: 1 } };
  //     const dto: QueuesQueryDto = {
  //       orthancSeriesIds: ['123', '456'],
  //     };
  //     jest.spyOn(service, 'checkIfUserIdHasJobs').mockResolvedValue(true);

  //     // ACT & ASSERT
  //     await expect(controller.addQueryJob(dto, mockRequest)).rejects.toThrow(
  //       ForbiddenException,
  //     );
  //     expect(service.checkIfUserIdHasJobs).toHaveBeenCalledWith(1);
  //     expect(service.checkIfUserIdHasJobs).toHaveBeenCalledTimes(1);
  //     expect(service.addJob).not.toHaveBeenCalled();
  //   });

  //   it('should call addQueryJob for each orthancSeriesId', async () => {
  //     // MOCK
  //     const mockRequest: any = { user: { userId: 1 } };
  //     const dto: QueuesQueryDto = {
  //       orthancSeriesIds: ['123', '456', '789'],
  //     };
  //     jest.spyOn(service, 'checkIfUserIdHasJobs').mockResolvedValue(false);
  //     jest.spyOn(service, 'addJob').mockResolvedValue();

  //     // ACT
  //     const result = await controller.addQueryJob(dto, mockRequest);

  //     // ASSERT
  //     expect(result).toHaveProperty('uuid');
  //     expect(service.checkIfUserIdHasJobs).toHaveBeenCalledWith(1);
  //     expect(service.addJob).toHaveBeenCalledTimes(
  //       dto.orthancSeriesIds.length,
  //     );
  //     dto.orthancSeriesIds.forEach((id) => {
  //       expect(service.addJob).toHaveBeenCalledWith({
  //         uuid: expect.any(String),
  //         userId: 1,
  //         orthancSeriesId: id,
  //       });
  //     });
  //   });
  // });

  describe('removeQueryJob', () => {
    it('should call removeQueryJob service method with the correct uuid', async () => {
      // MOCK
      const uuid = 'test-uuid';
      jest.spyOn(service, 'removeJob').mockResolvedValue();

      // ACT
      await controller.removeQueryJob(uuid);

      // ASSERT
      expect(service.removeJob).toHaveBeenCalledWith({ uuid });
      expect(service.removeJob).toHaveBeenCalledTimes(1);
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
            state: 'waiting',
            userId: 1,
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
        ['job1']: {
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
