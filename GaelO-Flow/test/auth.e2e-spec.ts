import { Get, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { AppModule } from '../src/app.module';
import { User } from '../src/users/user.entity';
import { MailService } from '../src/mail/mail.service';
import { generateToken, getTokenExpiration } from '../src/utils/passwords';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let server: any = null;

  let userRepositoy: Repository<User>;
  let mailService = {
    sendChangePasswordEmail: jest.fn(),
  };

  let accessToken: string = undefined;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MailService)
      .useValue(mailService)
      .compile();

    app = moduleFixture.createNestApplication();
    userRepositoy = moduleFixture.get(getRepositoryToken(User));
    server = app.getHttpServer();

    await app.init();
  });

  afterAll(async () => {
    await userRepositoy.delete({
      Email: 'johndoe@gaelo.com',
    });
    await app.close();
    await server.close();
  });

  it('/login (POST)', async () => {
    const response = await request(server).post('/login').send({
      Email: 'admin@gaelo.com',
      Password: 'passwordadmin',
    });
    expect(response.status).toBe(200);
    expect(response.body.AccessToken).toBeDefined();
    expect(response.body.UserId).toBeDefined();
    accessToken = response.body.AccessToken;
  });

  // it('oauth2 (POST)', async () => {
  //   // TODO: HOW TO TEST THIS ROUTE ?
  // });

  it('/register (POST)', async () => {
    const response = await request(server).post('/register').send({
      Email: 'johndoe@gaelo.com',
      Firstname: 'John',
      Lastname: 'Doe',
    });

    expect(mailService.sendChangePasswordEmail).toHaveBeenCalled();
    expect(response.status).toBe(201);
  });

  it('/change-password (POST)', async () => {
    const token = await generateToken();
    const hash = token.hash;
    const confirmationToken = token.token;
    const user = await userRepositoy.findOneBy({ Email: 'johndoe@gaelo.com' });

    user.TokenExpiration = getTokenExpiration();
    user.Token = hash;
    user.Password = null;

    await userRepositoy.update(user.Id, user);

    const response = await request(server).post('/change-password').send({
      Token: confirmationToken,
      NewPassword: 'NewPassw0rd!',
      ConfirmationPassword: 'NewPassw0rd!',
      UserId: user.Id,
    });

    expect(response.status).toBe(201);
  });

  it('/lost-password (POST)', async () => {
    const response = await request(server)
      .post('/lost-password')
      .send({ Email: 'johndoe@gaelo.com' });

    expect(mailService.sendChangePasswordEmail).toHaveBeenCalled();
    expect(response.status).toBe(201); // TODO: WHY 201 ??
  });
});
