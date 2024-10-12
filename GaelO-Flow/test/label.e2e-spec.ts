import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { createCustomJwt, loginAsAdmin, loginAsUser } from './login';

describe('Labels (e2e)', () => {
  let app: INestApplication;
  let server: any = null;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    server = app.getHttpServer();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await server.close();
  });

  describe('ADMIN', () => {
    let adminToken: string = '';
    let asminId: number = 0;

    it('/login (POST)', async () => {
      const body = await loginAsAdmin(server);
      adminToken = body.AccessToken;
      asminId = body.UserId;
      expect(adminToken).toBeDefined();
      expect(asminId).toBeDefined();
    });

    it('/labels (POST)', async () => {
      const response = await request(server)
        .post('/labels')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          Name: 'TestLabel',
        });
      expect(response.status).toBe(201);
    });

    it('/labels (GET)', async () => {
      const response = await request(server)
        .get('/labels')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toContain('TestLabel');
    });

    it('/labels/:id (DELETE)', async () => {
      const response = await request(server)
        .delete(`/labels/TestLabel`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
    });
  });

  describe('USER', () => {
    let userToken: string = '';
    let userId: number = 0;

    it('/login (POST)', async () => {
      const body = await loginAsUser(server);
      userToken = body.AccessToken;
      userId = body.UserId;
      expect(userToken).toBeDefined();
      expect(userId).toBeDefined();
    });

    it('/labels (POST)', async () => {
      const response = await request(server)
        .post('/labels')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          Name: 'TestLabel',
        });

      expect(response.status).toBe(403);
    });

    it('/labels (GET)', async () => {
      const readAllToken = await createCustomJwt(app, { ReadAll: true });
      const response = await request(server)
        .get('/labels')
        .set('Authorization', `Bearer ${readAllToken}`);

      expect(response.status).toBe(200);
    });

    it('/labels (GET)', async () => {
      const importToken = await createCustomJwt(app, { Import: true });
      const response = await request(server)
        .get('/labels')
        .set('Authorization', `Bearer ${importToken}`);

      expect(response.status).toBe(403);
    });

    it('/labels/:id (DELETE)', async () => {
      const response = await request(server)
        .delete(`/labels/1`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });
  });
});
