import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../app.module';
import { loginAsAdmin, loginAsUser } from '../../test/login';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let server: any = null;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
    await server.close();
  });

  describe('ADMIN', () => {
    let adminToken: string = '';
    let adminId: number = 0;

    let newUserId: number = 0;

    it('/auth/login (POST)', async () => {
      const body = await loginAsAdmin(server);
      adminToken = body.AccessToken;
      adminId = body.UserId;
      expect(adminToken).toBeDefined();
      expect(adminId).toBeDefined();
    });

    it('/users (GET)', async () => {
      const response = await request(server)
        .get('/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });

    it('/users/:id (GET)', async () => {
      const response = await request(server)
        .get(`/users/${adminId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.Id).toBe(adminId);
    });

    it('/users (POST)', async () => {
      const response = await request(server)
        .post('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          Firstname: 'test',
          Lastname: 'test',
          Username: 'test',
          Email: 'test@test.com',
          Password: 'test',
          Role: 'user',
        });

      newUserId = parseInt(response.text);
      expect(response.status).toBe(201);
    });

    it('/users/:id (PUT)', async () => {
      const response = await request(server)
        .put(`/users/${newUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          Firstname: 'john',
          Lastname: 'doe',
        });

      expect(response.status).toBe(200);
    });

    it('/users/:id (DELETE)', async () => {
      const response = await request(server)
        .delete(`/users/${newUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
    });
  });

  describe('USER', () => {
    let userToken: string = '';
    let userId: number = 0;

    it('/auth/login (POST)', async () => {
      const body = await loginAsUser(server);
      userToken = body.AccessToken;
      userId = body.UserId;
      expect(userToken).toBeDefined();
      expect(userId).toBeDefined();
    });

    it('/users (GET)', async () => {
      const response = await request(server)
        .get('/users')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });

    it('/users/:id (GET) 200', async () => {
      const response = await request(server)
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.body.Id).toBe(userId);
      expect(response.status).toBe(200);
    });

    it('/users/:id (GET) 403', async () => {
      const response = await request(server)
        .get(`/users/${0}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });

    it('/users (POST)', async () => {
      const response = await request(server)
        .post('/users')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          Firstname: 'test',
          Lastname: 'test',
          Username: 'test',
          Email: 'test@test.com',
          Password: 'test',
          Role: 'user',
        });

      expect(response.status).toBe(403);
    });

    it('/users/:id (PUT)', async () => {
      const response = await request(server)
        .put(`/users/${0}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          Firstname: 'john',
          Lastname: 'doe',
        });

      expect(response.status).toBe(403);
    });

    it('/users/:id (DELETE)', async () => {
      const response = await request(server)
        .delete(`/users/${0}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });
  });
});
