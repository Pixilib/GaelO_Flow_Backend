import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigService } from '@nestjs/config';
import { CreateRoleDto } from '../src/roles/dto/create-role.dto';
import { JwtService } from '@nestjs/jwt';

async function loginAsAdmin(server: any) {
  const response = await request(server).post('/login').send({
    Email: 'admin@gaelo.com',
    Password: 'passwordadmin',
  });

  return response.body;
}

async function loginAsUser(server: any) {
  const response = await request(server).post('/login').send({
    Email: 'user@gaelo.com',
    Password: 'passworduser',
  });

  return response.body;
}

async function createCustomJwt(
  app: INestApplication,
  role: object,
  userId: number = 0,
) {
  const configService = app.get(ConfigService);
  const jwtService = app.get(JwtService);
  const jwtSecret = configService.get<string>('JWT_SECRET');

  const payload = {
    email: 'CUSTOM@MAIL.COM',
    role: {
      Name: role['Name'] ? role['Name'] : 'CustomRole',
      Import: role['Import'] ? role['Import'] : false,
      Anonymize: role['Anonymize'] ? role['Anonymize'] : false,
      Export: role['Export'] ? role['Export'] : false,
      Query: role['Query'] ? role['Query'] : false,
      AutoQuery: role['AutoQuery'] ? role['AutoQuery'] : false,
      Delete: role['Delete'] ? role['Delete'] : false,
      Admin: role['Admin'] ? role['Admin'] : false,
      Modify: role['Modify'] ? role['Modify'] : false,
      CdBurner: role['CdBurner'] ? role['CdBurner'] : false,
      AutoRouting: role['AutoRouting'] ? role['AutoRouting'] : false,
      ReadAll: role['ReadAll'] ? role['ReadAll'] : false,
    } as CreateRoleDto,
    userId: userId,
  };

  return jwtService.sign(payload, { secret: jwtSecret });
}

export { loginAsAdmin, loginAsUser, createCustomJwt };
