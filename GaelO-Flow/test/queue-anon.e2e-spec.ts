import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { createCustomJwt } from './login';
import { QueuesAnonService } from '../src/queues/anon/queue-anons.service';
import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';

describe('QueueAnon (e2e)', () => {
  let app: INestApplication;
  let server: any = null;

  let queueAnonService: QueuesAnonService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    queueAnonService = moduleFixture.get<QueuesAnonService>(QueuesAnonService);
    queueAnonService.queue = {
      obliterate: jest.fn(),
      getJobs: jest.fn().mockReturnValue([]),
      add: jest.fn(),
    } as any;

    server = app.getHttpServer();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await server.close();
  });

  describe('ADMIN PERMISSION', () => {
    let token: string;

    beforeAll(async () => {
      token = await createCustomJwt(app, { Admin: true });
    });

    it('/queues/anon (DELETE)', async () => {
      const response = await request(server)
        .delete('/queues/anon')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(queueAnonService.queue.obliterate).toHaveBeenCalledWith({
        force: true,
      });
    });

    it('/queues/anon (GET)', async () => {
      const response = await request(server)
        .get('/queues/anon')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(queueAnonService.queue.getJobs).toHaveBeenCalled();
    });

    it('/queues/anon/:uuid (GET)', async () => {
      const response = await request(server)
        .get('/queues/anon/uuid')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(queueAnonService.queue.getJobs).toHaveBeenCalled();
    });

    it('/queues/anon (POST)', async () => {
      const response = await request(server)
        .post('/queues/anon')
        .set('Authorization', `Bearer ${token}`)
        .send({
          Anonymizes: [
            {
              OrthancStudyID: 'orthanc_study_id',
              Profile: 'profile',
              NewAccessionNumber: 'new_accession_number',
              NewPatientID: 'new_patient_id',
              NewPatientName: 'new_patient_name',
              NewStudyDescription: 'new_study_description',
            },
          ],
        });

      expect(response.status).toBe(403);
      expect(queueAnonService.queue.getJobs).toHaveBeenCalled();
    });

    it('/queues/anon/:uuid (DELETE)', async () => {
      const response = await request(server)
        .delete('/queues/anon/uuid')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(queueAnonService.queue.getJobs).toHaveBeenCalled();
    });
  });

  describe('ANONYMIZE PERMISSION', () => {
    let token: string;

    beforeAll(async () => {
      token = await createCustomJwt(app, { Anonymize: true });
    });

    it('/queues/anon (DELETE)', async () => {
      const response = await request(server)
        .delete('/queues/anon')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });

    it('/queues/anon (GET)', async () => {
      const response = await request(server)
        .get('/queues/anon')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });

    it('/queues/anon/:uuid (GET)', async () => {
      const response = await request(server)
        .get('/queues/anon/uuid')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(queueAnonService.queue.getJobs).toHaveBeenCalled();
    });

    it('/queues/anon (POST)', async () => {
      const response = await request(server)
        .post('/queues/anon')
        .set('Authorization', `Bearer ${token}`)
        .send({
          Anonymizes: [
            {
              OrthancStudyID: 'orthanc_study_id',
              Profile: 'profile',
              NewAccessionNumber: 'new_accession_number',
              NewPatientID: 'new_patient_id',
              NewPatientName: 'new_patient_name',
              NewStudyDescription: 'new_study_description',
            },
          ],
        });

      expect(response.status).toBe(201);
      expect(queueAnonService.queue.getJobs).toHaveBeenCalled();
    });

    it('/queues/anon/:uuid (DELETE)', async () => {
      const response = await request(server)
        .delete('/queues/anon/uuid')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(queueAnonService.queue.getJobs).toHaveBeenCalled();
    });
  });
});
