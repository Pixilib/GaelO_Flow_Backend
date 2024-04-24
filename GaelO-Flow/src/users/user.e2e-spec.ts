import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as request from 'supertest';

import { AppModule } from '../app.module';

import { User } from './user.entity';
import { Role } from '../roles/role.entity';
import { hashPassword } from '../utils/passwords';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  let adminToken: string = '';
  let adminId: number = 0;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );

    const hash: string = await hashPassword('passwordadmin');

    const adminRole = new Role();
    adminRole.Name = 'Admin';

    await userRepository.save({
      Firstname: 'Admin',
      Lastname: 'Admin',
      Username: 'admin',
      Email: 'admin@localhost.com',
      Password: hash,
      SuperAdmin: true,
      RoleName: adminRole.Name,
    });

    // get admin token
    const response = await request(app.getHttpServer()).post('/login').send({
      Username: 'admin',
      Password: 'passwordadmin',
    });
    adminToken = response.body.AccessToken;
    adminId = response.body.UserId;
  });

  afterEach(async () => {
    await userRepository.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users (GET)', async () => {
    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body.length).toBeGreaterThan(0);
      });
  });

  it('/users/:id (GET)', async () => {
    return request(app.getHttpServer())
      .get(`/users/${adminId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body.Id).toBe(adminId);
      });
  });
});
