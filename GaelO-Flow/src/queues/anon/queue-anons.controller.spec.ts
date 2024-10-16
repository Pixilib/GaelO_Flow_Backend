import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { QueuesAnonController } from './queue-anons.controller';
import { QueuesAnonService } from './queue-anons.service';
import { QueuesAnonsDto } from './queue-anons.dto';
import { AdminGuard, AnonymizeGuard } from '../../guards/roles.guard';

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
            getAllUuids: jest.fn(),
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

  describe('getUuid', () => {
    it('check if getUuid has AdminGuard and AnonymizeGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        QueuesAnonController.prototype.getUuid,
      );

      const orGuards = new guards[0]().__getGuards();
      expect(orGuards.length).toBe(2);
      expect(orGuards[0]).toBe(AdminGuard);
      expect(orGuards[1]).toBe(AnonymizeGuard);
    });

    it('should return all uuids if no userId is provided and user is admin', async () => {
      // MOCK
      const mockUuids = ['test-uuid-1', 'test-uuid-2'];
      const mockReq = {
        user: {
          userId: 1,
          role: {
            Admin: true,
          },
        },
      };

      jest.spyOn(service, 'getAllUuids').mockResolvedValue(mockUuids);

      // ACT
      const result = await controller.getUuid(undefined, mockReq as any);

      // ASSERT
      expect(service.getAllUuids).toHaveBeenCalledWith();
      expect(result).toEqual(mockUuids);
    });

    it('should return the uuid of a specific user if userId is provided and user is admin', async () => {
      // MOCK
      const mockUuid = 'test-uuid-1';
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
      const result = await controller.getUuid(2, mockReq as any);

      // ASSERT
      expect(service.getUuidOfUser).toHaveBeenCalledWith(2);
      expect(result).toEqual([mockUuid]);
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
      await expect(controller.getUuid(2, mockReq as any)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should return the uuid of the user if userId is the same as the user', async () => {
      // MOCK
      const mockUuid = 'test-uuid-1';
      const mockReq = {
        user: {
          userId: 1,
          role: {
            Admin: false,
          },
        },
      };

      // ACT
      jest.spyOn(service, 'getUuidOfUser').mockResolvedValue(mockUuid);
      const result = await controller.getUuid(1, mockReq as any);

      // ASSERT
      expect(service.getUuidOfUser).toHaveBeenCalledWith(1);
      expect(result).toEqual([mockUuid]);
    });

    it('should return empty array if no uuids are found for the user', async () => {
      // MOCK
      const mockReq = {
        user: {
          userId: 1,
          role: {
            Admin: false,
          },
        },
      };

      // ACT
      jest.spyOn(service, 'getUuidOfUser').mockResolvedValue(null);
      const result = await controller.getUuid(1, mockReq as any);

      // ASSERT
      expect(service.getUuidOfUser).toHaveBeenCalledWith(1);
      expect(result).toEqual([]);
    });
  });

  describe('getJobs', () => {
    it('check if getJobs has AdminGuard and AnonymizeGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        QueuesAnonController.prototype.getJobs,
      );

      const orGuards = new guards[0]().__getGuards();
      expect(orGuards.length).toBe(2);
      expect(orGuards[0]).toBe(AdminGuard);
      expect(orGuards[1]).toBe(AnonymizeGuard);
    });

    it('Should throw BadRequestException if uuid is not provided', async () => {
      // MOCK
      const mockReq = {
        user: {
          userId: 1,
          role: {
            Admin: true,
          },
        },
      };

      // ACT & ASSERT
      await expect(
        controller.getJobs(undefined, mockReq as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should return all jobs with the uuid of another user', async () => {
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
      const result = await controller.getJobs('test-uuid', mockReq as any);

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

      // ACT & ASSERT
      await expect(
        controller.getJobs('test-uuid', mockReq as any),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should return all jobs with the uuid of the user', async () => {
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

      // ACT
      jest.spyOn(service, 'getUuidOfUser').mockResolvedValue('test-uuid');
      jest.spyOn(service, 'getJobsForUuid').mockResolvedValue(mockJobs);
      const result = await controller.getJobs('test-uuid', mockReq as any);

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
            Profile: 'Default',
            NewAccessionNumber: 'newaccessionnumber',
            NewPatientID: 'newpatientid',
            NewPatientName: 'newpatientname',
            NewStudyDescription: 'newstudydescription',
          },
          {
            OrthancStudyID: 'orthancstudyid2',
            Profile: 'Default',
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
