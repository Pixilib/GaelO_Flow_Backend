import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { createCustomJwt } from './login';
import { QueuesDeleteService } from '../src/queues/delete/queue-deletes.service';
import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';

describe('QueueDelete (e2e)', () => {
  let app: INestApplication;
  let server: any = null;

  let queuesDeleteService: QueuesDeleteService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    queuesDeleteService =
      moduleFixture.get<QueuesDeleteService>(QueuesDeleteService);
    queuesDeleteService.queue = {
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

    it('/queues/delete (DELETE)', async () => {
      const response = await request(server)
        .delete('/queues/delete')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(queuesDeleteService.queue.obliterate).toHaveBeenCalledWith({
        force: true,
      });
    });

    it('/queues/delete (GET)', async () => {
      const response = await request(server)
        .get('/queues/delete')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(queuesDeleteService.queue.getJobs).toHaveBeenCalled();
    });

    it('/queues/delete/:uuid (GET)', async () => {
      const response = await request(server)
        .get('/queues/delete/uuid')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(queuesDeleteService.queue.getJobs).toHaveBeenCalled();
    });

    it('/queues/delete (POST)', async () => {
      const response = await request(server)
        .post('/queues/delete')
        .set('Authorization', `Bearer ${token}`)
        .send({
          OrthancSeriesIds: [],
        });

      expect(response.status).toBe(403);
      expect(queuesDeleteService.queue.getJobs).toHaveBeenCalled();
    });

    it('/queues/delete/:uuid (DELETE)', async () => {
      const response = await request(server)
        .delete('/queues/delete/uuid')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(queuesDeleteService.queue.getJobs).toHaveBeenCalled();
    });
  });

  describe('QUERY PERMISSION', () => {
    let token: string;

    beforeAll(async () => {
      token = await createCustomJwt(app, { Delete: true });
    });

    it('/queues/delete (DELETE)', async () => {
      const response = await request(server)
        .delete('/queues/delete')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });

    it('/queues/delete (GET)', async () => {
      const response = await request(server)
        .get('/queues/delete')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });

    it('/queues/delete/:uuid (GET)', async () => {
      const response = await request(server)
        .get('/queues/delete/uuid')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(queuesDeleteService.queue.getJobs).toHaveBeenCalled();
    });

    it('/queues/delete (POST)', async () => {
      const response = await request(server)
        .post('/queues/delete')
        .set('Authorization', `Bearer ${token}`)
        .send({
          OrthancSeriesIds: [],
        });

      expect(response.status).toBe(201);
      expect(queuesDeleteService.queue.getJobs).toHaveBeenCalled();
    });

    it('/queues/delete/:uuid (DELETE)', async () => {
      const response = await request(server)
        .delete('/queues/delete/uuid')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(queuesDeleteService.queue.getJobs).toHaveBeenCalled();
    });
  });
});
