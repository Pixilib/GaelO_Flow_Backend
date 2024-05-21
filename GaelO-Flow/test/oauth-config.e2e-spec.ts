import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { AppModule } from '../src/app.module';
import { Autorouting } from '../src/autorouting/autorouting.entity';
import { loginAsAdmin, loginAsUser } from './login';

describe('OauthConfig (e2e)', () => {
  let app: INestApplication;
  let server: any = null;

  let autoroutingRepositoy: Repository<Autorouting>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    autoroutingRepositoy = moduleFixture.get(getRepositoryToken(Autorouting));
    server = app.getHttpServer();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await server.close();
  });

  describe('ADMIN', () => {
    let adminToken: string = '';
    let adminId: number = 0;

    it('/login (POST)', async () => {
      const body = await loginAsAdmin(server);
      adminToken = body.AccessToken;
      adminId = body.UserId;
      expect(adminToken).toBeDefined();
      expect(adminId).toBeDefined();
    });

    it('/oauth-config (POST)', async () => {
      const response = await request(server)
        .post('/oauth-config')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          Name: 'Test',
          Provider: '',
          AuthorizationUrl: '',
          ClientId: '',
        });

      expect(response.status).toBe(201);
    });

    it('/oauth-config (GET)', async () => {
      const response = await request(server)
        .get('/oauth-config')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body).toContainEqual({
        Name: 'Test',
        Provider: '',
        AuthorizationUrl: '',
        ClientId: '',
      });
    });

    it('/oauth-config/:id (DELETE)', async () => {
      const response = await request(server)
        .delete(`/oauth-config/Test`)
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

    it('/oauth-config (POST)', async () => {
      const response = await request(server)
        .post('/oauth-config')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          Name: 'Test',
          Provider: '',
          AuthorizationUrl: '',
          ClientId: '',
        });

      expect(response.status).toBe(403);
    });

    it('/oauth-config (GET)', async () => {
      const response = await request(server)
        .get('/oauth-config')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });

    it('/oauth-config/:id (DELETE)', async () => {
      const response = await request(server)
        .delete(`/oauth-config/Test`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });
  });
});
