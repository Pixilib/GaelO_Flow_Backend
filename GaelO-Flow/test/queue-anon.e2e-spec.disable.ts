import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { AppModule } from '../src/app.module';
import { loginAsAdmin, loginAsUser } from './login';
import { Role } from '../src/roles/role.entity';
import { User } from '../src/users/user.entity';
import { hashPassword } from '../src/utils/passwords';

describe('QueueAnon (e2e)', () => {
  let app: INestApplication;
  let server: any = null;

  let roleRepositoy: Repository<Role>;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    roleRepositoy = moduleFixture.get(getRepositoryToken(Role));
    userRepository = moduleFixture.get(getRepositoryToken(User));
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

    let newJobUuid: string = '';

    it('/login (POST)', async () => {
      const body = await loginAsAdmin(server);
      adminToken = body.AccessToken;
      adminId = body.UserId;
      expect(adminToken).toBeDefined();
      expect(adminId).toBeDefined();
    });

    it('/queues/anon (DELETE)', async () => {
      const response = await request(server)
        .delete('/queues/anon')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
    });

    it('/queues/anon (POST)', async () => {
      const response = await request(server)
        .post('/queues/anon')
        .set('Authorization', `Bearer ${adminToken}`)
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

      expect(response.status).toBe(405);
    });

    it('/queues/anon (GET)', async () => {
      const response = await request(server)
        .get('/queues/anon')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
    });

    it('/queues/anon/:uuid (GET)', async () => {
      const response = await request(server)
        .get('/queues/anon/uuid')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(400);
    });

    it('/queues/anon/:uuid (DELETE)', async () => {
      const response = await request(server)
        .delete('/queues/anon/uuid')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(400);
    });
  });

  describe('USER (with Anonymize permission)', () => {
    let userToken: string = '';
    let userId: number = 0;

    it('/login (POST)', async () => {
      const body = await loginAsUser(server);
      userToken = body.AccessToken;
      userId = body.UserId;
      expect(userToken).toBeDefined();
      expect(userId).toBeDefined();
    });

    it('/queues/anon (DELETE)', async () => {
      const response = await request(server)
        .delete('/queues/anon')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('noAnonymizeNoAdmin', () => {
    let user: User;
    let token: string = '';

    beforeAll(async () => {
      await roleRepositoy.save({
        Name: 'NoAnonymizeNoAdmin',
        Import: true,
        Anonymize: false,
        Export: true,
        Query: true,
        AutoQuery: true,
        Delete: true,
        Admin: false,
        Modify: true,
        CdBurner: true,
        AutoRouting: true,
        ReadAll: true,
      });
      await userRepository.save({
        RoleName: 'NoAnonymizeNoAdmin',
        Email: 'queue-anon@gaelo.fr',
        Password: await hashPassword('queue-anon'),
        Firstname: 'Queue',
        Lastname: 'Anon',
      });
      user = await userRepository.findOne({
        where: { Email: 'queue-anon@gaelo.fr' },
        relations: ['Role'],
      });
    });

    afterAll(async () => {
      await userRepository.delete({ Email: 'queue-anon@gaelo.fr' });
      await roleRepositoy.delete({ Name: 'NoAnonymizeNoAdmin' });
    });

    it('/login (POST)', async () => {
      const body = await request(server).post('/login').send({
        Email: 'queue-anon@gaelo.fr',
        Password: 'queue-anon',
      });

      expect(body.status).toBe(200);
      expect(body.body.AccessToken).toBeDefined();
      token = body.body.AccessToken;
    });
  });
});
