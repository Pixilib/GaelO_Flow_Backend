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
          },
        },
      ],
    }).compile();

    service = module.get<QueuesAnonService>(QueuesAnonService);
    controller = module.get<QueuesAnonController>(QueuesAnonController);
  });

  describe('getJobs', () => {
    // get all the jobs
    it('should return all jobs for all users (admin)', async () => {
      // MOCK
      const mockJobs: any = {
        ['job1']: {
          progress: 0,
          state: 'waiting',
          id: 'job1',
          results: null
        },
        ['job2']: {
          progress: 0,
          state: 'waiting',
          id: 'job2',
          results: null
        },
        ['job3']: {
          progress: 0,
          state: 'waiting',
          id: 'job2',
          results: null
        },
      };
      const mockReq = {
        user: {
          userId: 1,
          role: {
            admin: true,
          },
        },
      };

      jest.spyOn(service, 'getJobsForUuid').mockResolvedValue(mockJobs);

      // ACT
      const result = await controller.getJobs(undefined, undefined, mockReq as any);

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
            admin: false,
          },
        },
      };

      // ACT & ASSERT
      await expect(controller.getJobs(undefined, undefined, mockReq as any)).rejects.toThrow(ForbiddenException);
    });

    // get uuid of user
    it('should return the uuid of a specific user (admin)', async () => {
      // MOCK
      const mockUuid = 'test-uuid';
      const mockReq = {
        user: {
          userId: 1,
          role: {
            admin: true,
          },
        },
      };

      jest.spyOn(service, 'getUuidOfUser').mockResolvedValue(mockUuid);

      // ACT
      const result = await controller.getJobs(2, undefined, mockReq as any);

      // ASSERT
      expect(service.getUuidOfUser).toHaveBeenCalledWith(2);
      expect(result).toEqual({uuid: mockUuid});
    });

    it('should throw ForbiddenException if user is not admin when trying to get uuid of another user', async () => {
      // MOCK
      const mockReq = {
        user: {
          userId: 1,
          role: {
            admin: false,
          },
        },
      };

      // ACT & ASSERT
      await expect(controller.getJobs(2, undefined, mockReq as any)).rejects.toThrow(ForbiddenException);
    });

    it('should return the uuid of the user (user)', async () => {
      // MOCK
      const mockUuid = 'test-uuid';
      const mockReq = {
        user: {
          userId: 1,
          role: {
            admin: false,
          },
        },
      };

      jest.spyOn(service, 'getUuidOfUser').mockResolvedValue(mockUuid);

      // ACT
      const result = await controller.getJobs(1, undefined, mockReq as any);

      // ASSERT
      expect(service.getUuidOfUser).toHaveBeenCalledWith(1);
      expect(result).toEqual({uuid: mockUuid});
    });

    // get jobs for uuid
    it('should return all jobs for a specific uuid (admin)', async () => {
      // MOCK
      const mockJobs: any = {
        ['job1']: {
          progress: 0,
          state: 'waiting',
          id: 'job1',
          results: null
        },
        ['job2']: {
          progress: 0,
          state: 'waiting',
          id: 'job2',
          results: null
        },
        ['job3']: {
          progress: 0,
          state: 'waiting',
          id: 'job2',
          results: null
        },
      };
      const mockReq = {
        user: {
          userId: 1,
          role: {
            admin: true,
          },
        },
      };

      jest.spyOn(service, 'getUuidOfUser').mockResolvedValue('test-uuid-2');
      jest.spyOn(service, 'getJobsForUuid').mockResolvedValue(mockJobs);

      // ACT
      const result = await controller.getJobs(undefined, 'test-uuid', mockReq as any);

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
            admin: false,
          },
        },
      };
      jest.spyOn(service, 'getUuidOfUser').mockResolvedValue('test-uuid-2');

      // ACT & ASSERT
      await expect(controller.getJobs(undefined, 'test-uuid', mockReq as any)).rejects.toThrow(ForbiddenException);
    });

    it('should return all jobs for a specific uuid (user)', async () => {
      // MOCK
      const mockJobs: any = {
        ['job1']: {
          progress: 0,
          state: 'waiting',
          id: 'job1',
          results: null
        },
        ['job2']: {
          progress: 0,
          state: 'waiting',
          id: 'job2',
          results: null
        },
        ['job3']: {
          progress: 0,
          state: 'waiting',
          id: 'job2',
          results: null
        },
      };
      const mockReq = {
        user: {
          userId: 1,
          role: {
            admin: false,
          },
        },
      };

      jest.spyOn(service, 'getUuidOfUser').mockResolvedValue('test-uuid');
      jest.spyOn(service, 'getJobsForUuid').mockResolvedValue(mockJobs);

      // ACT
      const result = await controller.getJobs(undefined, 'test-uuid', mockReq as any);

      // ASSERT
      expect(service.getJobsForUuid).toHaveBeenCalledWith('test-uuid');
      expect(result).toEqual(mockJobs);
    });
  });

  describe('addAnonJob', () => {
    it('should return a UUID when a anon job is added', async () => {
      // MOCK
      const mockRequest: any = { user: { userId: 1 } };
      const dto: QueuesAnonsDto = {
        anonymizes: [
          {
            orthancStudyID: 'orthancstudyid',
            profile: 'profile',
            newAccessionNumber: 'newaccessionnumber',
            newPatientID: 'newpatientid',
            newPatientName: 'newpatientname',
            newStudyDescription: 'newstudydescription',
          },
        ],
      };
      jest.spyOn(service, 'checkIfUserIdHasJobs').mockResolvedValue(false);
      jest.spyOn(service, 'addJob').mockResolvedValue();

      // ACT
      const result = await controller.addAnonJob(dto, mockRequest);

      // ASSERT
      expect(result).toHaveProperty('uuid');
      expect(service.checkIfUserIdHasJobs).toHaveBeenCalledWith(1);
      expect(service.checkIfUserIdHasJobs).toHaveBeenCalledTimes(1);
      expect(service.addJob).toHaveBeenCalledWith({
        uuid: expect.any(String),
        userId: 1,
        results: null,
        anonymize: dto.anonymizes[0],
      });
      expect(service.addJob).toHaveBeenCalledTimes(dto.anonymizes.length);
    });

    it('should throw ForbiddenException if user already has jobs', async () => {
      // MOCK
      const mockRequest: any = { user: { userId: 1 } };
      const dto: QueuesAnonsDto = {
        anonymizes: [
          {
            orthancStudyID: 'orthancstudyid',
            profile: 'profile',
            newAccessionNumber: 'newaccessionnumber',
            newPatientID: 'newpatientid',
            newPatientName: 'newpatientname',
            newStudyDescription: 'newstudydescription',
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
        anonymizes: [
          {
            orthancStudyID: 'orthancstudyid',
            profile: 'profile',
            newAccessionNumber: 'newaccessionnumber',
            newPatientID: 'newpatientid',
            newPatientName: 'newpatientname',
            newStudyDescription: 'newstudydescription',
          },
          {
            orthancStudyID: 'orthancstudyid2',
            profile: 'profile2',
            newAccessionNumber: 'newaccessionnumber2',
            newPatientID: 'newpatientid2',
            newPatientName: 'newpatientname2',
            newStudyDescription: 'newstudydescription2',
          }
        ],
      };
      jest.spyOn(service, 'checkIfUserIdHasJobs').mockResolvedValue(false);
      jest.spyOn(service, 'addJob').mockResolvedValue();
  
      // ACT
      const result = await controller.addAnonJob(dto, mockRequest);
  
      // ASSERT
      expect(result).toHaveProperty('uuid');
      expect(service.checkIfUserIdHasJobs).toHaveBeenCalledWith(1);
      expect(service.addJob).toHaveBeenCalledTimes(dto.anonymizes.length);
      dto.anonymizes.forEach((anon) => {
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
    it('should call removeJob service method with the correct uuid', async () => {
      // MOCK
      const uuid = 'test-uuid';
      jest.spyOn(service, 'removeJob').mockResolvedValue();

      // ACT
      await controller.removeAnonJob(uuid);

      // ASSERT
      expect(service.removeJob).toHaveBeenCalledWith({ uuid });
      expect(service.removeJob).toHaveBeenCalledTimes(1);
    });
  });

  // describe('removeAnonJob', () => {
  //   it('should call removeAnonJob service method with the correct uuid', async () => {
  //     // MOCK
  //     const uuid = 'test-uuid';
  //     jest.spyOn(service, 'removeJob').mockResolvedValue();

  //     // ACT
  //     await controller.removeAnonJob(uuid);

  //     // ASSERT
  //     expect(service.removeJob).toHaveBeenCalledWith({ uuid });
  //     expect(service.removeJob).toHaveBeenCalledTimes(1);
  //   });
  // });

//   describe('addAnonJob', () => {
//     it('should return a UUID when a anon job is added', async () => {
//       // MOCK
//       const mockRequest: any = { user: { userId: 1 } };
//       const dto: QueuesAnonsDto = {
//         anonymizes: [
//           {
//             orthancStudyID: 'orthancstudyid',
//             profile: 'profile',
//             newAccessionNumber: 'newaccessionnumber',
//             newPatientID: 'newpatientid',
//             newPatientName: 'newpatientname',
//             newStudyDescription: 'newstudydescription',
//           },
//         ],
//       };
//       jest.spyOn(service, 'checkIfUserIdHasJobs').mockResolvedValue(false);
//       jest.spyOn(service, 'addJob').mockResolvedValue();

//       // ACT
//       const result = await controller.addAnonJob(dto, mockRequest);

//       // ASSERT
//       expect(result).toHaveProperty('uuid');
//       expect(service.checkIfUserIdHasJobs).toHaveBeenCalledWith(1);
//       expect(service.checkIfUserIdHasJobs).toHaveBeenCalledTimes(1);
//       expect(service.addJob).toHaveBeenCalledWith({
//         uuid: expect.any(String),
//         userId: 1,
//         anonymize: dto.anonymizes[0],
//       });
//       expect(service.addJob).toHaveBeenCalledTimes(dto.anonymizes.length);
//     });

//     it('should throw ForbiddenException if user already has jobs', async () => {
//       // MOCK
//       const mockRequest: any = { user: { userId: 1 } };
//       const dto: QueuesAnonsDto = {
//         anonymizes: [
//           {
//             orthancStudyID: 'orthancstudyid',
//             profile: 'profile',
//             newAccessionNumber: 'newaccessionnumber',
//             newPatientID: 'newpatientid',
//             newPatientName: 'newpatientname',
//             newStudyDescription: 'newstudydescription',
//           },
//         ],
//       };
//       jest.spyOn(service, 'checkIfUserIdHasJobs').mockResolvedValue(true);

//       // ACT & ASSERT
//       await expect(controller.addAnonJob(dto, mockRequest)).rejects.toThrow(
//         ForbiddenException,
//       );
//       expect(service.checkIfUserIdHasJobs).toHaveBeenCalledWith(1);
//       expect(service.checkIfUserIdHasJobs).toHaveBeenCalledTimes(1);
//       expect(service.addJob).not.toHaveBeenCalled();
//     });

//     it('should call addAnonJob for each orthancSeriesId', async () => {
//       // MOCK
//       const mockRequest: any = { user: { userId: 1 } };
//       const dto: QueuesAnonsDto = {
//         anonymizes: [
//           {
//             orthancStudyID: 'orthancstudyid',
//             profile: 'profile',
//             newAccessionNumber: 'newaccessionnumber',
//             newPatientID: 'newpatientid',
//             newPatientName: 'newpatientname',
//             newStudyDescription: 'newstudydescription',
//           },
//         ],
//       };
//       jest.spyOn(service, 'checkIfUserIdHasJobs').mockResolvedValue(false);
//       jest.spyOn(service, 'addJob').mockResolvedValue();

//       // ACT
//       const result = await controller.addAnonJob(dto, mockRequest);

//       // ASSERT
//       expect(result).toHaveProperty('uuid');
//       expect(service.checkIfUserIdHasJobs).toHaveBeenCalledWith(1);
//       expect(service.addJob).toHaveBeenCalledTimes(dto.anonymizes.length);
//       dto.anonymizes.forEach((id) => {
//         expect(service.addJob).toHaveBeenCalledWith({
//           uuid: expect.any(String),
//           userId: 1,
//           anonymize: id,
//         });
//       });
//     });
//   });

//   describe('removeAnonJob', () => {
//     it('should call removeAnonJob service method with the correct uuid', async () => {
//       // MOCK
//       const uuid = 'test-uuid';
//       jest.spyOn(service, 'removeJob').mockResolvedValue();

//       // ACT
//       await controller.removeAnonJob(uuid);

//       // ASSERT
//       expect(service.removeJob).toHaveBeenCalledWith({ uuid });
//       expect(service.removeJob).toHaveBeenCalledTimes(1);
//     });
//   });

});


