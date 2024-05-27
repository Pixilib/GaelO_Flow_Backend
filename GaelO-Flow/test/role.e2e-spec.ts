import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';

import { Label } from '../src/labels/label.entity';
import { loginAsAdmin, loginAsUser } from './login';

describe('Role (e2e)', () => {
  let labelRepository: Repository<Label>;
  let app: INestApplication;
  let server: any = null;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    server = app.getHttpServer();
    labelRepository = moduleFixture.get(getRepositoryToken(Label));

    const label = new Label();
    label.Name = 'TestRole';
    await labelRepository.save(label);

    await app.init();
  });

  afterAll(async () => {
    await labelRepository.delete({ Name: 'TestRole' });
    await app.close();
    await server.close();
  });

  describe('ADMIN', () => {
    let adminToken: string = '';
    let adminId: number = 0;

    describe('Roles', () => {
      it('/login (POST)', async () => {
        const body = await loginAsAdmin(server);
        adminToken = body.AccessToken;
        adminId = body.UserId;
        expect(adminToken).toBeDefined();
        expect(adminId).toBeDefined();
      });

      it('/roles (GET)', async () => {
        const response = await request(server)
          .get('/roles')
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
      });

      it('/roles/:name (GET)', async () => {
        const response = await request(server)
          .get(`/roles/Admin`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.Name).toBe('Admin');
      });

      it('/roles (POST)', async () => {
        const response = await request(server)
          .post('/roles')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            Name: 'TestRole',
            Import: true,
            Anonymize: true,
            Export: true,
            Query: true,
            AutoQuery: true,
            Delete: true,
            Admin: true,
            Modify: true,
            CdBurner: true,
            AutoRouting: true,
          });

        expect(response.status).toBe(201);
      });

      it('/roles/:name (PUT)', async () => {
        const response = await request(server)
          .put(`/roles/TestRole`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            Import: false,
            Anonymize: false,
            Export: false,
            Query: false,
            AutoQuery: false,
            Delete: false,
            Admin: false,
            Modify: false,
            CdBurner: false,
            AutoRouting: false,
          });

        expect(response.status).toBe(200);
      });

      it('/roles/:name (DELETE)', async () => {
        const response = await request(server)
          .delete(`/roles/TestRole`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
      });
    });

    describe('RolesLabels', () => {
      it('/roles/:roleName/label (POST)', async () => {
        const response = await request(server)
          .post(`/roles/Admin/label`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            Name: 'TestRole',
          });

        expect(response.status).toBe(201);
      });

      it('/roles/:roleName/labels (GET)', async () => {
        const response = await request(server)
          .get(`/roles/Admin/labels`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
      });

      it('/roles/:roleName/labels/:label (DELETE)', async () => {
        const response = await request(server)
          .delete(`/roles/Admin/label/TestRole`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
      });
    });
  });

  describe('USER', () => {
    let userToken: string = '';
    let userId: number = 0;

    describe('Roles', () => {
      it('/login (POST)', async () => {
        const body = await loginAsUser(server);
        userToken = body.AccessToken;
        userId = body.UserId;
        expect(userToken).toBeDefined();
        expect(userId).toBeDefined();
      });

      it('/roles (GET) - 403', async () => {
        const response = await request(server)
          .get('/roles')
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(403);
      });

      it('/roles/:name (GET)', async () => {
        const response = await request(server)
          .get(`/roles/Admin`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(403);
      });

      it('/roles (POST)', async () => {
        const response = await request(server)
          .post('/roles')
          .set('Authorization', `Bearer ${userToken}`)
          .send({
            Name: 'TestRole',
            Import: true,
            Anonymize: true,
            Export: true,
            Query: true,
            AutoQuery: true,
            Delete: true,
            Admin: true,
            Modify: true,
            CdBurner: true,
            AutoRouting: true,
          });

        expect(response.status).toBe(403);
      });

      it('/roles/:name (PUT)', async () => {
        const response = await request(server)
          .put(`/roles/TestRole`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({
            Import: false,
            Anonymize: false,
            Export: false,
            Query: false,
            AutoQuery: false,
            Delete: false,
            Admin: false,
            Modify: false,
            CdBurner: false,
            AutoRouting: false,
          });

        expect(response.status).toBe(403);
      });

      it('/roles/:name (DELETE)', async () => {
        const response = await request(server)
          .delete(`/roles/TestRole`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(403);
      });
    });

    describe('RolesLabels', () => {
      it('/roles/:roleName/label (POST) - 403', async () => {
        const response = await request(server)
          .post(`/roles/Admin/label`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({
            Name: 'TestRole',
          });

        expect(response.status).toBe(403);
      });

      it('/roles/:roleName/label (POST) - 201', async () => {
        const response = await request(server)
          .post(`/roles/User/label`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({
            Name: 'TestRole',
          });

        expect(response.status).toBe(201);
      });

      it('/roles/:roleName/labels (GET) - 403', async () => {
        const response = await request(server)
          .get(`/roles/Admin/labels`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(403);
      });

      it('/roles/:roleName/labels (GET) - 200', async () => {
        const response = await request(server)
          .get(`/roles/User/labels`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
      });

      it('/roles/:roleName/labels/:label (DELETE) - 403', async () => {
        const response = await request(server)
          .delete(`/roles/Admin/label/TestRole`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(403);
      });

      it('/roles/:roleName/labels/:label (DELETE) - 200', async () => {
        const response = await request(server)
          .delete(`/roles/User/label/TestRole`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
      });
    });
  });
});
