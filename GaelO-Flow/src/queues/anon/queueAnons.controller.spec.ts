import { Test } from '@nestjs/testing';
import { QueuesAnonController } from './queueAnons.controller';
import { QueuesAnonService } from './queueAnons.service';
import { QueuesAnonsDto } from './queueAnons.dto';
import { ForbiddenException } from '@nestjs/common';

describe('QueuesAnonController', () => {
  let controller: QueuesAnonController;
  let service: QueuesAnonService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [QueuesAnonController],
      providers: [
        {
          provide: QueuesAnonService,
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

    service = module.get<QueuesAnonService>(QueuesAnonService);
    controller = module.get<QueuesAnonController>(QueuesAnonController);
  });

  describe('flushQueue', () => {
    it('check if flushQueue has AdminGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        QueuesAnonController.prototype.flushQueue,
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
    it('check if getJobs has AdminGuard and AnonymiseGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        QueuesAnonController.prototype.getJobs,
      );
      const guardNames = guards[0].guards.map(
        (guard: any) => guard.constructor.name,
      );
      expect(guards.length).toBe(1);
      expect(guards[0].constructor.name).toBe('OrGuard');
      expect(guardNames.length).toBe(2);
      expect(guardNames).toContain('AdminGuard');
      expect(guardNames).toContain('AnonymizeGuard');
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

  describe('addAnonJob', () => {
    it('check if addAnonJob has AnonymiseGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        QueuesAnonController.prototype.addAnonJob,
      );
      const guardNames = guards.map((guard: any) => guard.name);

      expect(guardNames.length).toBe(1);
      expect(guardNames).toContain('AnonymizeGuard');
    });

    it('should return a UUID when a anon job is added', async () => {
      // MOCK
      const mockRequest: any = { user: { userId: 1 } };
      const dto: QueuesAnonsDto = {
        Anonymizes: [
          {
            OrthancStudyID: 'orthancstudyid',
            Profile: 'profile',
            NewAccessionNumber: 'newaccessionnumber',
            NewPatientID: 'newpatientid',
            NewPatientName: 'newpatientname',
            NewStudyDescription: 'newstudydescription',
          },
        ],
      };
      jest.spyOn(service, 'checkIfUserIdHasJobs').mockResolvedValue(false);
      jest.spyOn(service, 'addJob').mockResolvedValue();

      // ACT
      const result = await controller.addAnonJob(dto, mockRequest);

      // ASSERT
      expect(result).toHaveProperty('Uuid');
      expect(service.checkIfUserIdHasJobs).toHaveBeenCalledWith(1);
      expect(service.checkIfUserIdHasJobs).toHaveBeenCalledTimes(1);
      expect(service.addJob).toHaveBeenCalledWith({
        uuid: expect.any(String),
        userId: 1,
        results: null,
        anonymize: dto.Anonymizes[0],
      });
      expect(service.addJob).toHaveBeenCalledTimes(dto.Anonymizes.length);
    });

    it('should throw ForbiddenException if user already has jobs', async () => {
      // MOCK
      const mockRequest: any = { user: { userId: 1 } };
      const dto: QueuesAnonsDto = {
        Anonymizes: [
          {
            OrthancStudyID: 'orthancstudyid',
            Profile: 'profile',
            NewAccessionNumber: 'newaccessionnumber',
            NewPatientID: 'newpatientid',
            NewPatientName: 'newpatientname',
            NewStudyDescription: 'newstudydescription',
          },
        ],
      };
      jest.spyOn(service, 'checkIfUserIdHasJobs').mockResolvedValue(true);

      // ACT & ASSERT
      await expect(controller.addAnonJob(dto, mockRequest)).rejects.toThrow(
        ForbiddenException,
      );
      expect(service.checkIfUserIdHasJobs).toHaveBeenCalledWith(1);
      expect(service.checkIfUserIdHasJobs).toHaveBeenCalledTimes(1);
      expect(service.addJob).not.toHaveBeenCalled();
    });

    it('should call addAnonJob for each orthancSeriesId', async () => {
      // MOCK
      const mockRequest: any = { user: { userId: 1 } };
      const dto: QueuesAnonsDto = {
        Anonymizes: [
          {
            OrthancStudyID: 'orthancstudyid',
            Profile: 'profile',
            NewAccessionNumber: 'newaccessionnumber',
            NewPatientID: 'newpatientid',
            NewPatientName: 'newpatientname',
            NewStudyDescription: 'newstudydescription',
          },
          {
            OrthancStudyID: 'orthancstudyid2',
            Profile: 'profile2',
            NewAccessionNumber: 'newaccessionnumber2',
            NewPatientID: 'newpatientid2',
            NewPatientName: 'newpatientname2',
            NewStudyDescription: 'newstudydescription2',
          },
        ],
      };
      jest.spyOn(service, 'checkIfUserIdHasJobs').mockResolvedValue(false);
      jest.spyOn(service, 'addJob').mockResolvedValue();

      // ACT
      const result = await controller.addAnonJob(dto, mockRequest);

      // ASSERT
      expect(result).toHaveProperty('Uuid');
      expect(service.checkIfUserIdHasJobs).toHaveBeenCalledWith(1);
      expect(service.addJob).toHaveBeenCalledTimes(dto.Anonymizes.length);
      dto.Anonymizes.forEach((anon) => {
        expect(service.addJob).toHaveBeenCalledWith({
          uuid: expect.any(String),
          userId: 1,
          anonymize: anon,
          results: null,
        });
      });
    });
  });

  describe('removeAnonJob', () => {
    it('check if removeAnonJob has AnonymiseGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        QueuesAnonController.prototype.removeAnonJob,
      );
      const guardNames = guards.map((guard: any) => guard.name);

      expect(guardNames.length).toBe(1);
      expect(guardNames).toContain('AnonymizeGuard');
    });

    it('should call removeJob service method with the correct uuid', async () => {
      // MOCK
      const uuid = 'test-uuid';
      jest.spyOn(service, 'removeJob').mockResolvedValue();

      // ACT
      await controller.removeAnonJob(uuid);

      // ASSERT
      expect(service.removeJob).toHaveBeenCalledWith({ Uuid: uuid });
      expect(service.removeJob).toHaveBeenCalledTimes(1);
    });
  });
});
