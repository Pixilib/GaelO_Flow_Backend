import { Test } from '@nestjs/testing';
import { QueuesDeleteController } from './queueDeletes.controller';
import { QueuesDeleteService } from './queueDeletes.service';
import { QueuesDeleteDto } from './queueDeletes.dto';
import { ForbiddenException } from '@nestjs/common';
import { Job } from 'bullmq';

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

    service = module.get<QueuesDeleteService>(QueuesDeleteService);
    controller = module.get<QueuesDeleteController>(QueuesDeleteController);
  });

  describe('getJobs', () => {
    it('should return all jobs for all users (admin)', async () => {
      // MOCK
      const uuid = 'test-uuid';
      const uuid2 = 'test-uuid2';
      const mockJobs: any = [
        {
          id: 'job1',
          name: 'job1',
          data: {
            uuid: uuid,
            orthancSeriesId: 'series1',
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
            orthancSeriesId: 'series2',
            state: 'waiting',
            userId: 1,
          },
          progress: 0,
        },
        {
          id: 'job3',
          name: 'job3',
          data: {
            uuid: uuid2,
            orthancSeriesId: 'series1',
            state: 'waiting',
            userId: 1,
          },
          progress: 0,
        },
      ];
      const mockReq = {
        user: {
          userId: 1,
          role: {
            admin: true
          }
        }
      }


      jest.spyOn(service, 'checkIfUserIdHasJobs').mockResolvedValue(false);
      jest.spyOn(service, 'getJobs').mockResolvedValue(mockJobs);

      // ACT
      const result = await controller.getJobs(1, uuid, mockReq as any);

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

  describe('addDeleteJob', () => {
    it('should return a UUID when a delete job is added', async () => {
      // MOCK
      const mockRequest: any = { user: { userId: 1 } };
      const dto: QueuesDeleteDto = {
        orthancSeriesIds: ['123', '456'],
      };
      jest.spyOn(service, 'checkIfUserIdHasJobs').mockResolvedValue(false);
      jest.spyOn(service, 'addJob').mockResolvedValue();

      // ACT
      const result = await controller.addDeleteJob(dto, mockRequest);

      // ASSERT
      expect(result).toHaveProperty('uuid');
      expect(service.checkIfUserIdHasJobs).toHaveBeenCalledWith(1);
      expect(service.checkIfUserIdHasJobs).toHaveBeenCalledTimes(1);
      expect(service.addJob).toHaveBeenCalledWith({
        uuid: expect.any(String),
        userId: 1,
        orthancSeriesId: '123',
      });
      expect(service.addJob).toHaveBeenCalledTimes(
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
      expect(service.addJob).not.toHaveBeenCalled();
    });

    it('should call addDeleteJob for each orthancSeriesId', async () => {
      // MOCK
      const mockRequest: any = { user: { userId: 1 } };
      const dto: QueuesDeleteDto = {
        orthancSeriesIds: ['123', '456', '789'],
      };
      jest.spyOn(service, 'checkIfUserIdHasJobs').mockResolvedValue(false);
      jest.spyOn(service, 'addJob').mockResolvedValue();

      // ACT
      const result = await controller.addDeleteJob(dto, mockRequest);

      // ASSERT
      expect(result).toHaveProperty('uuid');
      expect(service.checkIfUserIdHasJobs).toHaveBeenCalledWith(1);
      expect(service.addJob).toHaveBeenCalledTimes(
        dto.orthancSeriesIds.length,
      );
      dto.orthancSeriesIds.forEach((id) => {
        expect(service.addJob).toHaveBeenCalledWith({
          uuid: expect.any(String),
          userId: 1,
          orthancSeriesId: id,
        });
      });
    });
  });

  describe('removeDeleteJob', () => {
    it('should call removeDeleteJob service method with the correct uuid', async () => {
      // MOCK
      const uuid = 'test-uuid';
      jest.spyOn(service, 'removeJob').mockResolvedValue();

      // ACT
      await controller.removeDeleteJob(uuid);

      // ASSERT
      expect(service.removeJob).toHaveBeenCalledWith({ uuid });
      expect(service.removeJob).toHaveBeenCalledTimes(1);
    });
  });
});
