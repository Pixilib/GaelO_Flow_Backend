import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { createCustomJwt } from './login';
import { QueuesQueryService } from '../src/queues/query/queue-query.service';
import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';

describe('QueueQuery (e2e)', () => {
  let app: INestApplication;
  let server: any = null;

  let queuesQueryService: QueuesQueryService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    queuesQueryService =
      moduleFixture.get<QueuesQueryService>(QueuesQueryService);
    queuesQueryService.queue = {
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

    it('/queues/query (DELETE)', async () => {
      const response = await request(server)
        .delete('/queues/query')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(queuesQueryService.queue.obliterate).toHaveBeenCalledWith({
        force: true,
      });
    });

    it('/queues/query (GET)', async () => {
      const response = await request(server)
        .get('/queues/query')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(queuesQueryService.queue.getJobs).toHaveBeenCalled();
    });

    it('/queues/query/:uuid (GET)', async () => {
      const response = await request(server)
        .get('/queues/query/uuid')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(queuesQueryService.queue.getJobs).toHaveBeenCalled();
    });

    it('/queues/query (POST)', async () => {
      const response = await request(server)
        .post('/queues/query')
        .set('Authorization', `Bearer ${token}`)
        .send({
          Series: [
            {
              PatientName: 'patient_name',
              PatientID: 'patient_id',
              StudyDate: 'patient_birthdate',
              Modality: 'modality',
              StudyDescription: 'study_description',
              AccessionNb: 'accession_nb',
              StudyInstanceUID: 'study_instance_uid',
              Aet: 'aet',
            },
          ],
          Studies: [],
        });

      expect(response.status).toBe(403);
      expect(queuesQueryService.queue.getJobs).toHaveBeenCalled();
    });

    it('/queues/query/:uuid (DELETE)', async () => {
      const response = await request(server)
        .delete('/queues/query/uuid')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(queuesQueryService.queue.getJobs).toHaveBeenCalled();
    });
  });

  describe('QUERY PERMISSION', () => {
    let token: string;

    beforeAll(async () => {
      token = await createCustomJwt(app, { Query: true });
    });

    it('/queues/query (DELETE)', async () => {
      const response = await request(server)
        .delete('/queues/query')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });

    it('/queues/query (GET)', async () => {
      const response = await request(server)
        .get('/queues/query')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });

    it('/queues/query/:uuid (GET)', async () => {
      const response = await request(server)
        .get('/queues/query/uuid')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(queuesQueryService.queue.getJobs).toHaveBeenCalled();
    });

    it('/queues/query (POST)', async () => {
      const response = await request(server)
        .post('/queues/query')
        .set('Authorization', `Bearer ${token}`)
        .send({
          Series: [
            {
              PatientName: 'patient_name',
              PatientID: 'patient_id',
              StudyDate: 'patient_birthdate',
              Modality: 'modality',
              StudyDescription: 'study_description',
              AccessionNb: 'accession_nb',
              StudyInstanceUID: 'study_instance_uid',
              Aet: 'aet',
            },
          ],
          Studies: [],
        });

      expect(response.status).toBe(201);
      expect(queuesQueryService.queue.getJobs).toHaveBeenCalled();
    });

    it('/queues/query/:uuid (DELETE)', async () => {
      const response = await request(server)
        .delete('/queues/query/uuid')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(queuesQueryService.queue.getJobs).toHaveBeenCalled();
    });
  });
});
