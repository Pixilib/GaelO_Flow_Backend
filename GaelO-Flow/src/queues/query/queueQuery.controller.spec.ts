import { Test } from '@nestjs/testing';
import { QueuesQueryController } from './queueQuery.controller';
import { QueuesQueryService } from './queueQuery.service';
import { QueuesQueryDto } from './queueQuery.dto';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { AdminGuard } from '../../roles/roles.guard';

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
            getJobsForUuid: jest.fn(),
            flush: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<QueuesQueryService>(QueuesQueryService);
    controller = module.get<QueuesQueryController>(QueuesQueryController);
  });

  describe('flushQueue', () => {
    it('check if flushQueue has AdminGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        QueuesQueryController.prototype.flushQueue,
      );
      const guardNames = guards.map((guard: any) => guard.name);

      expect(guardNames.length).toBe(1);
      expect(guardNames).toContain('AdminGuard');
    });

    it('should call flush service method', async () => {
      // MOCK
      jest.spyOn(service, 'flush').mockResolvedValue();

      // ACT
      await controller.flushQueue();

      // ASSERT
      expect(service.flush).toHaveBeenCalledWith();
      expect(service.flush).toHaveBeenCalledTimes(1);
    });
  });

  describe('getJobs', () => {
    it('check if getJobs has AdminGuard and QueryGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        QueuesQueryController.prototype.getJobs,
      );
      const guardNames = guards[0].guards.map(
        (guard: any) => guard.constructor.name,
      );
      expect(guards.length).toBe(1);
      expect(guards[0].constructor.name).toBe('OrGuard');
      expect(guardNames.length).toBe(2);
      expect(guardNames).toContain('AdminGuard');
      expect(guardNames).toContain('QueryGuard');
    });

    it('should return all jobs for all users (admin)', async () => {
      // MOCK
      const mockJobs: any = {
        ['job1']: {
          Progress: 0,
          State: 'waiting',
          Id: 'job1',
          Results: null,
        },
        ['job2']: {
          Progress: 0,
          State: 'waiting',
          Id: 'job2',
          Results: null,
        },
        ['job3']: {
          Progress: 0,
          State: 'waiting',
          Id: 'job2',
          Results: null,
        },
      };
      const mockReq = {
        user: {
          userId: 1,
          role: {
            Admin: true,
          },
        },
      };

      jest.spyOn(service, 'getJobsForUuid').mockResolvedValue(mockJobs);

      // ACT
      const result = await controller.getJobs(
        undefined,
        undefined,
        mockReq as any,
      );

      // ASSERT
      expect(service.getJobsForUuid).toHaveBeenCalledWith();
      expect(result).toEqual(mockJobs);
    });

    it('should throw ForbiddenException if user is not admin when trying to get all the jobs', async () => {
      // MOCK
      const mockReq = {
        user: {
          userId: 1,
          role: {
            Admin: false,
          },
        },
      };

      // ACT & ASSERT
      await expect(
        controller.getJobs(undefined, undefined, mockReq as any),
      ).rejects.toThrow(ForbiddenException);
    });

    // get uuid of user
    it('should return the uuid of a specific user (admin)', async () => {
      // MOCK
      const mockUuid = 'test-uuid';
      const mockReq = {
        user: {
          userId: 1,
          role: {
            Admin: true,
          },
        },
      };

      jest.spyOn(service, 'getUuidOfUser').mockResolvedValue(mockUuid);

      // ACT
      const result = await controller.getJobs(2, undefined, mockReq as any);

      // ASSERT
      expect(service.getUuidOfUser).toHaveBeenCalledWith(2);
      expect(result).toEqual({ uuid: mockUuid });
    });

    it('should throw ForbiddenException if user is not admin when trying to get uuid of another user', async () => {
      // MOCK
      const mockReq = {
        user: {
          userId: 1,
          role: {
            Admin: false,
          },
        },
      };

      // ACT & ASSERT
      await expect(
        controller.getJobs(2, undefined, mockReq as any),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should return the uuid of the user (user)', async () => {
      // MOCK
      const mockUuid = 'test-uuid';
      const mockReq = {
        user: {
          userId: 1,
          role: {
            Admin: false,
          },
        },
      };

      jest.spyOn(service, 'getUuidOfUser').mockResolvedValue(mockUuid);

      // ACT
      const result = await controller.getJobs(1, undefined, mockReq as any);

      // ASSERT
      expect(service.getUuidOfUser).toHaveBeenCalledWith(1);
      expect(result).toEqual({ uuid: mockUuid });
    });

    // get jobs for uuid
    it('should return all jobs for a specific uuid (admin)', async () => {
      // MOCK
      const mockJobs: any = {
        ['job1']: {
          Progress: 0,
          State: 'waiting',
          Id: 'job1',
          Results: null,
        },
        ['job2']: {
          Progress: 0,
          State: 'waiting',
          Id: 'job2',
          Results: null,
        },
        ['job3']: {
          Progress: 0,
          State: 'waiting',
          Id: 'job2',
          Results: null,
        },
      };
      const mockReq = {
        user: {
          userId: 1,
          role: {
            Admin: true,
          },
        },
      };

      jest.spyOn(service, 'getUuidOfUser').mockResolvedValue('test-uuid-2');
      jest.spyOn(service, 'getJobsForUuid').mockResolvedValue(mockJobs);

      // ACT
      const result = await controller.getJobs(
        undefined,
        'test-uuid',
        mockReq as any,
      );

      // ASSERT
      expect(service.getJobsForUuid).toHaveBeenCalledWith('test-uuid');
      expect(result).toEqual(mockJobs);
    });

    it('should throw ForbiddenException if user is not admin when trying to get jobs for another uuid', async () => {
      // MOCK
      const mockReq = {
        user: {
          userId: 1,
          role: {
            Admin: false,
          },
        },
      };
      jest.spyOn(service, 'getUuidOfUser').mockResolvedValue('test-uuid-2');

      // ACT & ASSERT
      await expect(
        controller.getJobs(undefined, 'test-uuid', mockReq as any),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should return all jobs for a specific uuid (user)', async () => {
      // MOCK
      const mockJobs: any = {
        ['job1']: {
          Progress: 0,
          State: 'waiting',
          Id: 'job1',
          Results: null,
        },
        ['job2']: {
          Progress: 0,
          State: 'waiting',
          Id: 'job2',
          Results: null,
        },
        ['job3']: {
          Progress: 0,
          State: 'waiting',
          Id: 'job2',
          Results: null,
        },
      };
      const mockReq = {
        user: {
          userId: 1,
          role: {
            Admin: false,
          },
        },
      };

      jest.spyOn(service, 'getUuidOfUser').mockResolvedValue('test-uuid');
      jest.spyOn(service, 'getJobsForUuid').mockResolvedValue(mockJobs);

      // ACT
      const result = await controller.getJobs(
        undefined,
        'test-uuid',
        mockReq as any,
      );

      // ASSERT
      expect(service.getJobsForUuid).toHaveBeenCalledWith('test-uuid');
      expect(result).toEqual(mockJobs);
    });
  });

  describe('addQueryJob', () => {
    it('check if addQueryJob has QueryGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        QueuesQueryController.prototype.addQueryJob,
      );
      const guardNames = guards.map((guard: any) => guard.name);

      expect(guardNames.length).toBe(1);
      expect(guardNames).toContain('QueryGuard');
    });

    it('should return a UUID when a delete job is added', async () => {
      // MOCK
      const mockRequest: any = { user: { userId: 1 } };
      const dto: QueuesQueryDto = {
        Series: [
          {
            StudyUID: '',
            Modality: '',
            ProtocolName: '',
            SeriesDescription: '',
            SeriesNumber: '',
            SeriesInstanceUID: '',
            Aet: '',
          },
        ],
        Studies: [
          {
            PatientName: '',
            PatientID: '',
            StudyDate: '',
            Modality: '',
            StudyDescription: '',
            AccessionNb: '',
            StudyInstanceUID: '',
            Aet: '',
          },
        ],
      };

      jest.spyOn(service, 'checkIfUserIdHasJobs').mockResolvedValue(false);
      jest.spyOn(service, 'addJob').mockResolvedValue();

      // ACT
      const result = await controller.addQueryJob(dto, mockRequest);

      // ASSERT
      expect(result).toHaveProperty('Uuid');
      expect(service.checkIfUserIdHasJobs).toHaveBeenCalledWith(1);
      expect(service.checkIfUserIdHasJobs).toHaveBeenCalledTimes(1);
      expect(service.addJob).toHaveBeenCalledWith(
        {
          userId: 1,
          uuid: expect.any(String),
          results: null,
          series: dto.Series[0],
        } || {
          userId: 1,
          uuid: expect.any(String),
          results: null,
          study: dto.Studies[0],
        },
      );
      expect(service.addJob).toHaveBeenCalledTimes(
        dto.Series.length + dto.Studies.length,
      );
    });

    it('should throw ForbiddenException if user already has jobs', async () => {
      // MOCK
      const mockRequest: any = { user: { userId: 1 } };
      const dto: QueuesQueryDto = {
        Series: [
          {
            StudyUID: '',
            Modality: '',
            ProtocolName: '',
            SeriesDescription: '',
            SeriesNumber: '',
            SeriesInstanceUID: '',
            Aet: '',
          },
        ],
        Studies: [
          {
            PatientName: '',
            PatientID: '',
            StudyDate: '',
            Modality: '',
            StudyDescription: '',
            AccessionNb: '',
            StudyInstanceUID: '',
            Aet: '',
          },
        ],
      };

      jest.spyOn(service, 'checkIfUserIdHasJobs').mockResolvedValue(true);
      await expect(controller.addQueryJob(dto, mockRequest)).rejects.toThrow(
        ForbiddenException,
      );
      expect(service.checkIfUserIdHasJobs).toHaveBeenCalledWith(1);
      expect(service.checkIfUserIdHasJobs).toHaveBeenCalledTimes(1);
      expect(service.addJob).not.toHaveBeenCalled();
    });

    it('should call addQueryJob for each series / study', async () => {
      // MOCK
      const mockRequest: any = { user: { userId: 1 } };
      const dto: QueuesQueryDto = {
        Series: [
          {
            StudyUID: '',
            Modality: '',
            ProtocolName: '',
            SeriesDescription: '',
            SeriesNumber: '',
            SeriesInstanceUID: '',
            Aet: '',
          },
          {
            StudyUID: '',
            Modality: '',
            ProtocolName: '',
            SeriesDescription: '',
            SeriesNumber: '',
            SeriesInstanceUID: '',
            Aet: '',
          },
        ],
        Studies: [
          {
            PatientName: '',
            PatientID: '',
            StudyDate: '',
            Modality: '',
            StudyDescription: '',
            AccessionNb: '',
            StudyInstanceUID: '',
            Aet: '',
          },
          {
            PatientName: '',
            PatientID: '',
            StudyDate: '',
            Modality: '',
            StudyDescription: '',
            AccessionNb: '',
            StudyInstanceUID: '',
            Aet: '',
          },
        ],
      };

      jest.spyOn(service, 'checkIfUserIdHasJobs').mockResolvedValue(false);
      jest.spyOn(service, 'addJob').mockResolvedValue();

      // ACT
      const result = await controller.addQueryJob(dto, mockRequest);

      // ASSERT
      expect(result).toHaveProperty('Uuid');
      expect(service.checkIfUserIdHasJobs).toHaveBeenCalledWith(1);
      expect(service.addJob).toHaveBeenCalledTimes(
        dto.Series.length + dto.Studies.length,
      );
      dto.Series.forEach((series) => {
        expect(service.addJob).toHaveBeenCalledWith({
          userId: 1,
          uuid: expect.any(String),
          results: null,
          series: series,
        });
      });
      dto.Studies.forEach((study) => {
        expect(service.addJob).toHaveBeenCalledWith({
          userId: 1,
          uuid: expect.any(String),
          results: null,
          study: study,
        });
      });
    });

    it('should throw BadRequestException if no series or studies are provided', async () => {
      // MOCK
      const mockRequest: any = { user: { userId: 1 } };
      const dto: QueuesQueryDto = {
        Series: [],
        Studies: [],
      };

      jest.spyOn(service, 'checkIfUserIdHasJobs').mockResolvedValue(false);
      jest.spyOn(service, 'addJob').mockResolvedValue();

      // ACT & ASSERT
      await expect(
        controller.addQueryJob(dto, mockRequest),
      ).rejects.toThrowError(BadRequestException);

      expect(service.checkIfUserIdHasJobs).toHaveBeenCalledWith(1);
      expect(service.checkIfUserIdHasJobs).toHaveBeenCalledTimes(1);
      expect(service.addJob).not.toHaveBeenCalled();
    });
  });

  describe('removeQueryJob', () => {
    it('check if removeQueryJob has QueryGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        QueuesQueryController.prototype.removeQueryJob,
      );
      const guardNames = guards.map((guard: any) => guard.name);

      expect(guardNames.length).toBe(1);
      expect(guardNames).toContain('QueryGuard');
    });

    it('should call removeJob service method with the correct uuid', async () => {
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
});
