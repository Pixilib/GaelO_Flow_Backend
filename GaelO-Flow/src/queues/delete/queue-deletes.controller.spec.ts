import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { QueuesDeleteController } from './queue-deletes.controller';
import { QueuesDeleteService } from './queue-deletes.service';
import { QueuesDeleteDto } from './queue-deletes.dto';

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

    service = module.get<QueuesDeleteService>(QueuesDeleteService);
    controller = module.get<QueuesDeleteController>(QueuesDeleteController);
  });

  describe('flushQueue', () => {
    it('check if flushQueue has AdminGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        QueuesDeleteController.prototype.flushQueue,
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
    it('check if getUuid has AdminGuard and DeleteGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        QueuesDeleteController.prototype.getUuid,
      );
      const guardNames = guards[0].guards.map(
        (guard: any) => guard.constructor.name,
      );

      expect(guards.length).toBe(1);
      expect(guards[0].constructor.name).toBe('OrGuard');
      expect(guardNames.length).toBe(2);
      expect(guardNames).toContain('AdminGuard');
      expect(guardNames).toContain('DeleteGuard');
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
    it('check if getJobs has AdminGuard and DeleteGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        QueuesDeleteController.prototype.getJobs,
      );
      const guardNames = guards[0].guards.map(
        (guard: any) => guard.constructor.name,
      );

      expect(guards.length).toBe(1);
      expect(guards[0].constructor.name).toBe('OrGuard');
      expect(guardNames.length).toBe(2);
      expect(guardNames).toContain('AdminGuard');
      expect(guardNames).toContain('DeleteGuard');
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

  // describe('getJobs', () => {
  //   it('check if getJobs has AdminGuard and DeleteGuard', async () => {
  //     const guards = Reflect.getMetadata(
  //       '__guards__',
  //       QueuesDeleteController.prototype.getJobs,
  //     );
  //     const guardNames = guards[0].guards.map(
  //       (guard: any) => guard.constructor.name,
  //     );
  //     expect(guards.length).toBe(1);
  //     expect(guards[0].constructor.name).toBe('OrGuard');
  //     expect(guardNames.length).toBe(2);
  //     expect(guardNames).toContain('AdminGuard');
  //     expect(guardNames).toContain('DeleteGuard');
  //   });

  //   it('should return all jobs for all users (admin)', async () => {
  //     // MOCK
  //     const mockJobs: any = {
  //       ['job1']: {
  //         Progress: 0,
  //         State: 'waiting',
  //         Id: 'job1',
  //         Results: null,
  //       },
  //       ['job2']: {
  //         Progress: 0,
  //         State: 'waiting',
  //         Id: 'job2',
  //         Results: null,
  //       },
  //       ['job3']: {
  //         Progress: 0,
  //         State: 'waiting',
  //         Id: 'job2',
  //         Results: null,
  //       },
  //     };
  //     const mockReq = {
  //       user: {
  //         UserId: 1,
  //         Role: {
  //           Admin: true,
  //         },
  //       },
  //     };

  //     jest.spyOn(service, 'getJobsForUuid').mockResolvedValue(mockJobs);

  //     // ACT
  //     const result = await controller.getJobs(
  //       undefined,
  //       undefined,
  //       mockReq as any,
  //     );

  //     // ASSERT
  //     expect(service.getJobsForUuid).toHaveBeenCalledWith();
  //     expect(result).toEqual(mockJobs);
  //   });

  //   it('should throw ForbiddenException if user is not admin when trying to get all the jobs', async () => {
  //     // MOCK
  //     const mockReq = {
  //       user: {
  //         UserId: 1,
  //         Role: {
  //           Admin: false,
  //         },
  //       },
  //     };

  //     // ACT & ASSERT
  //     await expect(
  //       controller.getJobs(undefined, undefined, mockReq as any),
  //     ).rejects.toThrow(ForbiddenException);
  //   });

  //   // get uuid of user
  //   it('should return the uuid of a specific user (admin)', async () => {
  //     // MOCK
  //     const mockUuid = 'test-uuid';
  //     const mockReq = {
  //       user: {
  //         UserId: 1,
  //         Role: {
  //           Admin: true,
  //         },
  //       },
  //     };

  //     jest.spyOn(service, 'getUuidOfUser').mockResolvedValue(mockUuid);

  //     // ACT
  //     const result = await controller.getJobs(2, undefined, mockReq as any);

  //     // ASSERT
  //     expect(service.getUuidOfUser).toHaveBeenCalledWith(2);
  //     expect(result).toEqual({ uuid: mockUuid });
  //   });

  //   it('should throw ForbiddenException if user is not admin when trying to get uuid of another user', async () => {
  //     // MOCK
  //     const mockReq = {
  //       user: {
  //         UserId: 1,
  //         Role: {
  //           Admin: false,
  //         },
  //       },
  //     };

  //     // ACT & ASSERT
  //     await expect(
  //       controller.getJobs(2, undefined, mockReq as any),
  //     ).rejects.toThrow(ForbiddenException);
  //   });

  //   it('should return the uuid of the user (user)', async () => {
  //     // MOCK
  //     const mockUuid = 'test-uuid';
  //     const mockReq = {
  //       user: {
  //         UserId: 1,
  //         Role: {
  //           Admin: false,
  //         },
  //       },
  //     };

  //     jest.spyOn(service, 'getUuidOfUser').mockResolvedValue(mockUuid);

  //     // ACT
  //     const result = await controller.getJobs(1, undefined, mockReq as any);

  //     // ASSERT
  //     expect(service.getUuidOfUser).toHaveBeenCalledWith(1);
  //     expect(result).toEqual({ uuid: mockUuid });
  //   });

  //   // get jobs for uuid
  //   it('should return all jobs for a specific uuid (admin)', async () => {
  //     // MOCK
  //     const mockJobs: any = {
  //       ['job1']: {
  //         Progress: 0,
  //         State: 'waiting',
  //         Id: 'job1',
  //         Results: null,
  //       },
  //       ['job2']: {
  //         Progress: 0,
  //         State: 'waiting',
  //         Id: 'job2',
  //         Results: null,
  //       },
  //       ['job3']: {
  //         Progress: 0,
  //         State: 'waiting',
  //         Id: 'job2',
  //         Results: null,
  //       },
  //     };
  //     const mockReq = {
  //       user: {
  //         UserId: 1,
  //         Role: {
  //           Admin: true,
  //         },
  //       },
  //     };

  //     jest.spyOn(service, 'getUuidOfUser').mockResolvedValue('test-uuid-2');
  //     jest.spyOn(service, 'getJobsForUuid').mockResolvedValue(mockJobs);

  //     // ACT
  //     const result = await controller.getJobs(
  //       undefined,
  //       'test-uuid',
  //       mockReq as any,
  //     );

  //     // ASSERT
  //     expect(service.getJobsForUuid).toHaveBeenCalledWith('test-uuid');
  //     expect(result).toEqual(mockJobs);
  //   });

  //   it('should throw ForbiddenException if user is not admin when trying to get jobs for another uuid', async () => {
  //     // MOCK
  //     const mockReq = {
  //       user: {
  //         UserId: 1,
  //         Role: {
  //           Admin: false,
  //         },
  //       },
  //     };
  //     jest.spyOn(service, 'getUuidOfUser').mockResolvedValue('test-uuid-2');

  //     // ACT & ASSERT
  //     await expect(
  //       controller.getJobs(undefined, 'test-uuid', mockReq as any),
  //     ).rejects.toThrow(ForbiddenException);
  //   });

  //   it('should return all jobs for a specific uuid (user)', async () => {
  //     // MOCK
  //     const mockJobs: any = {
  //       ['job1']: {
  //         Progress: 0,
  //         State: 'waiting',
  //         Id: 'job1',
  //         Results: null,
  //       },
  //       ['job2']: {
  //         Progress: 0,
  //         State: 'waiting',
  //         Id: 'job2',
  //         Results: null,
  //       },
  //       ['job3']: {
  //         Progress: 0,
  //         State: 'waiting',
  //         Id: 'job2',
  //         Results: null,
  //       },
  //     };
  //     const mockReq = {
  //       user: {
  //         UserId: 1,
  //         Role: {
  //           Admin: false,
  //         },
  //       },
  //     };

  //     jest.spyOn(service, 'getUuidOfUser').mockResolvedValue('test-uuid');
  //     jest.spyOn(service, 'getJobsForUuid').mockResolvedValue(mockJobs);

  //     // ACT
  //     const result = await controller.getJobs(
  //       undefined,
  //       'test-uuid',
  //       mockReq as any,
  //     );

  //     // ASSERT
  //     expect(service.getJobsForUuid).toHaveBeenCalledWith('test-uuid');
  //     expect(result).toEqual(mockJobs);
  //   });
  // });

  describe('addDeleteJob', () => {
    it('check if addDeleteJob has DeleteGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        QueuesDeleteController.prototype.addDeleteJob,
      );
      const guardNames = guards.map((guard: any) => guard.name);

      expect(guardNames.length).toBe(1);
      expect(guardNames).toContain('DeleteGuard');
    });

    it('should return a UUID when a delete job is added', async () => {
      // MOCK
      const mockRequest: any = { user: { userId: 1 } };
      const dto: QueuesDeleteDto = {
        OrthancSeriesIds: ['123', '456'],
      };
      jest.spyOn(service, 'checkIfUserIdHasJobs').mockResolvedValue(false);
      jest.spyOn(service, 'addJob').mockResolvedValue();

      // ACT
      const result = await controller.addDeleteJob(dto, mockRequest);

      // ASSERT
      expect(result).toHaveProperty('Uuid');
      expect(service.checkIfUserIdHasJobs).toHaveBeenCalledWith(1);
      expect(service.checkIfUserIdHasJobs).toHaveBeenCalledTimes(1);
      expect(service.addJob).toHaveBeenCalledWith({
        uuid: expect.any(String),
        userId: 1,
        orthancSeriesId: '123',
        results: null,
      });
      expect(service.addJob).toHaveBeenCalledTimes(dto.OrthancSeriesIds.length);
    });

    it('should throw ForbiddenException if user already has jobs', async () => {
      // MOCK
      const mockRequest: any = { user: { userId: 1 } };
      const dto: QueuesDeleteDto = {
        OrthancSeriesIds: ['123', '456'],
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
        OrthancSeriesIds: ['123', '456', '789'],
      };
      jest.spyOn(service, 'checkIfUserIdHasJobs').mockResolvedValue(false);
      jest.spyOn(service, 'addJob').mockResolvedValue();

      // ACT
      const result = await controller.addDeleteJob(dto, mockRequest);

      // ASSERT
      expect(result).toHaveProperty('Uuid');
      expect(service.checkIfUserIdHasJobs).toHaveBeenCalledWith(1);
      expect(service.addJob).toHaveBeenCalledTimes(dto.OrthancSeriesIds.length);
      dto.OrthancSeriesIds.forEach((id) => {
        expect(service.addJob).toHaveBeenCalledWith({
          uuid: expect.any(String),
          userId: 1,
          orthancSeriesId: id,
          results: null,
        });
      });
    });
  });

  describe('removeDeleteJob', () => {
    it('check if removeDeleteJob has DeleteGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        QueuesDeleteController.prototype.removeDeleteJob,
      );
      const guardNames = guards.map((guard: any) => guard.name);

      expect(guardNames.length).toBe(1);
      expect(guardNames).toContain('DeleteGuard');
    });

    it('should call removeJob service method with the correct uuid', async () => {
      // MOCK
      const uuid = 'test-uuid';
      jest.spyOn(service, 'removeJob').mockResolvedValue();

      // ACT
      await controller.removeDeleteJob(uuid);

      // ASSERT
      expect(service.removeJob).toHaveBeenCalledWith({ Uuid: uuid });
      expect(service.removeJob).toHaveBeenCalledTimes(1);
    });
  });
});
