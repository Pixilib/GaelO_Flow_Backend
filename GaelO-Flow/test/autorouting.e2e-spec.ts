import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { AppModule } from '../src/app.module';
import { Autorouting } from '../src/autorouting/autorouting.entity';
import { createCustomJwt, loginAsAdmin } from './login';

describe('Autorouting (e2e)', () => {
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

    let newAutoroutingId: number = undefined;

    it('/login (POST)', async () => {
      const body = await loginAsAdmin(server);
      adminToken = body.AccessToken;
      adminId = body.UserId;
      expect(adminToken).toBeDefined();
      expect(adminId).toBeDefined();
    });

    it('autorouting (POST)', async () => {
      const response = await request(server)
        .post('/autorouting')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          Name: 'Test',
          EventType: 'NewInstance',
          Activated: false,
          Router: {
            RuleCondition: 'AND',
            Rules: [
              {
                DicomTag: 'PatientName',
                ValueRepresentation: 'string',
                Value: 'value',
                Condition: 'EQUALS',
              },
            ],
            Destination: [
              {
                Destination: 'AET',
                Name: 'value',
              },
            ],
          },
        });
      expect(response.status).toBe(201);
    });

    it('autorouting (GET)', async () => {
      const response = await request(server)
        .get('/autorouting')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);

      newAutoroutingId = response.body[0].Id;
    });

    it('autorouting/:id/enable (POST)', async () => {
      const response = await request(server)
        .post(`/autorouting/${newAutoroutingId}/enable`) // TODO: SHOULD BE PUT ?
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(201); // TODO: SHOULD BE 200
      expect(
        (await autoroutingRepositoy.findOneBy({ Id: newAutoroutingId }))
          .Activated,
      ).toBe(true);
    });

    it('autorouting/:id/disable (POST)', async () => {
      const response = await request(server)
        .post(`/autorouting/${newAutoroutingId}/disable`) // TODO: SHOULD BE PUT ?
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(201); // TODO: SHOULD BE 200
      expect(
        (await autoroutingRepositoy.findOneBy({ Id: newAutoroutingId }))
          .Activated,
      ).toBe(false);
    });

    it('autorouting/:id (DELETE)', async () => {
      const response = await request(server)
        .delete(`/autorouting/${newAutoroutingId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
    });
  });

  describe('NO AUTOROUTING PERMISSION', () => {
    let token: string;

    beforeAll(async () => {
      token = await createCustomJwt(app, {});
    });

    it('autorouting (POST)', async () => {
      const response = await request(server)
        .post('/autorouting')
        .set('Authorization', `Bearer ${token}`)
        .send({
          Name: 'Test',
          EventType: 'NewInstance',
          Activated: false,
          Router: {
            RuleCondition: 'AND',
            Rules: [
              {
                DicomTag: 'PatientName',
                ValueRepresentation: 'string',
                Value: 'value',
                Condition: 'EQUALS',
              },
            ],
            Destination: [
              {
                Destination: 'AET',
                Name: 'value',
              },
            ],
          },
        });
      expect(response.status).toBe(403);
    });

    it('autorouting (GET)', async () => {
      const response = await request(server)
        .get('/autorouting')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });

    it('autorouting/:id/enable (POST)', async () => {
      const response = await request(server)
        .post(`/autorouting/${0}/enable`) // TODO: SHOULD BE PUT ?
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });

    it('autorouting/:id/disable (POST)', async () => {
      const response = await request(server)
        .post(`/autorouting/${0}/disable`) // TODO: SHOULD BE PUT ?
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });

    it('autorouting/:id (DELETE)', async () => {
      const response = await request(server)
        .delete(`/autorouting/${0}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });
  });
});
