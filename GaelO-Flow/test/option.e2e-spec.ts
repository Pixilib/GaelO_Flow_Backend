import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { AppModule } from '../src/app.module';
import { loginAsAdmin, loginAsUser } from './login';
import { Option } from '../src/options/option.entity';

describe('Option (e2e)', () => {
  let app: INestApplication;
  let server: any = null;

  let optionRepositoy: Repository<Option>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    optionRepositoy = moduleFixture.get(getRepositoryToken(Option));
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

    it('/options (GET)', async () => {
      const response = await request(server)
        .get('/options')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('AutoQueryHourStart');
      expect(response.body).toHaveProperty('AutoQueryMinuteStart');
      expect(response.body).toHaveProperty('AutoQueryHourStop');
      expect(response.body).toHaveProperty('AutoQueryMinuteStop');
      expect(response.body).toHaveProperty('OrthancMonitoringRate');
      expect(response.body).toHaveProperty('BurnerStarted');
      expect(response.body).toHaveProperty('BurnerLabelPath');
      expect(response.body).toHaveProperty('BurnerMonitoringLevel');
      expect(response.body).toHaveProperty('BurnerManifacturer');
      expect(response.body).toHaveProperty('BurnerMonitoredPath');
      expect(response.body).toHaveProperty('BurnerDeleteStudyAfterSent');
      expect(response.body).toHaveProperty('BurnerSupportType');
      expect(response.body).toHaveProperty('BurnerViewerPath');
      expect(response.body).toHaveProperty('BurnerTransferSyntax');
      expect(response.body).toHaveProperty('BurnerDateFormat');
      expect(response.body).toHaveProperty('BurnerTranscoding');
      expect(response.body).toHaveProperty('AutorouterStarted');
      expect(response.body).toHaveProperty('OrthancAddress');
      expect(response.body).toHaveProperty('OrthancUsername');
      expect(response.body).toHaveProperty('OrthancPassword');
      expect(response.body).toHaveProperty('RedisAddress');
      expect(response.body).toHaveProperty('RedisPort');
    });

    it('/options (Patch)', async () => {
      const response = await request(server)
        .patch('/options')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          AutoQueryHourStart: 0,
          AutoQueryMinuteStart: 0,
          AutoQueryHourStop: 0,
          AutoQueryMinuteStop: 0,
          OrthancMonitoringRate: 0,
          BurnerStarted: true,
          BurnerLabelPath: 'string',
          BurnerMonitoringLevel: 'string',
          BurnerManifacturer: 'string',
          BurnerMonitoredPath: 'string',
          BurnerDeleteStudyAfterSent: true,
          BurnerSupportType: 'string',
          BurnerViewerPath: 'string',
          BurnerTransferSyntax: 'ing',
          BurnerDateFormat: 'string',
          BurnerTranscoding: 'string',
          AutorouterStarted: true,
        });

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

    it('/options (GET)', async () => {
      const response = await request(server)
        .get('/options')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });

    it('/options (Patch)', async () => {
      const response = await request(server)
        .patch('/options')
        .set('Authorization', `Bearer ${userToken}`)
        .send({});

      expect(response.status).toBe(403);
    });
  });
});
