import { Delete, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { AppModule } from '../src/app.module';
import { Autorouting } from '../src/autorouting/autorouting.entity';
import { createCustomJwt, loginAsAdmin } from './login';
import { ProcessingQueueService } from '../src/processing/processing-queue.service';

describe('Processing (e2e)', () => {
  let app: INestApplication;
  let server: any = null;

  let processingQueueService: ProcessingQueueService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    server = app.getHttpServer();
    processingQueueService = moduleFixture.get<ProcessingQueueService>(
      ProcessingQueueService,
    );
    processingQueueService.processingQueue = {
      obliterate: jest.fn(),
      getJobs: jest.fn().mockReturnValue([]),
      add: jest.fn(),
    } as any;

    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await server.close();
  });

  describe('ADMIN', () => {
    let adminToken: string;
    let adminId: number;

    beforeAll(async () => {
      const respnse = await loginAsAdmin(server);
      adminToken = respnse.AccessToken;
      adminId = respnse.UserId;
    });

    it('/processing (DELETE)', async () => {
      const response = await request(server)
        .delete('/processing')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
    });

    it('/processing (GET)', async () => {
      const response = await request(server)
        .get('/processing')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
    });

    it('/processing/<uuid> (GET)', async () => {
      const response = await request(server)
        .get('/processing/uuid')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
    });

    it('/processing (POST)', async () => {
      const response = await request(server)
        .post('/processing')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          JobType: 'tmtv',
          TmtvJob: {
            CtOrthancSeriesId: '123',
            PtOrthancSeriesId: '456',
            SendMaskToOrthancAs: ['MASK'],
            WithFragmentedMask: false,
          },
        });

      expect(response.status).toBe(201);
    });

    it('/processing/<uuid>  (DELETE)', async () => {
      const response = await request(server)
        .delete('/processing/uuid')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
    });
  });

  describe('READALL', () => {
    let token: string;

    beforeAll(async () => {
      token = await createCustomJwt(app, { ReadAll: true });
    });

    it('/processing (DELETE)', async () => {
      const response = await request(server)
        .delete('/processing')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });

    it('/processing (GET)', async () => {
      const response = await request(server)
        .get('/processing')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });

    it('/processing/<uuid> (GET)', async () => {
      const response = await request(server)
        .get('/processing/uuid')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });

    it('/processing (POST)', async () => {
      const response = await request(server)
        .post('/processing')
        .set('Authorization', `Bearer ${token}`)
        .send({
          JobType: 'tmtv',
          TmtvJob: {
            CtOrthancSeriesId: '123',
            PtOrthancSeriesId: '456',
            SendMaskToOrthancAs: ['MASK'],
            WithFragmentedMask: false,
          },
        });

      expect(response.status).toBe(201);
    });

    it('/processing/<uuid>  (DELETE)', async () => {
      const response = await request(server)
        .delete('/processing/uuid')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });
  });
});
