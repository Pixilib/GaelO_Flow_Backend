import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentification (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/authentification test', () => {
    return request(app.getHttpServer())
      .get('/authentification/5')
      .expect(200)
      .expect('coucou5');
  });

  it('/ (POST)', () => {
    return request(app.getHttpServer())
      .post('/authentification')
      .send(JSON.stringify({ chat: true }))
      .set('Content-type', 'application/json')
      .expect(201)
      .expect(JSON.stringify({ chat: true }));
  });
});
