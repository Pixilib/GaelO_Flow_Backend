import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import OrthancClient from './orthanc/OrthancClient';
import setupDeleteWorker from './queues/delete/deleteWorker';
import setupAnonWorker from './queues/anon/anonWorker';
import setupQueryWorker from './queues/query/queryWorker';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function main() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'oauth2-redirect.html', method: RequestMethod.GET }],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(validationErrors);
      },
    }),
  );

  const configService = app.get(ConfigService);
  const orthancClient = app.get(OrthancClient);
  const port = configService.get<number>('API_PORT', 3000);
  const config = new DocumentBuilder()
    .setTitle('GaelO Flow API')
    .setDescription('The GaelO Flow API description')
    .setVersion('2.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addOAuth2(
      {
        type: 'oauth2',
        flows: {
          implicit: {
            authorizationUrl:
              'http://localhost:8080/realms/master/protocol/openid-connect/auth',
            scopes: { openid: 'openid' },
          },
        },
      },
      'oauth2',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  setupDeleteWorker(orthancClient, configService);
  setupAnonWorker(orthancClient, configService);
  setupQueryWorker(orthancClient, configService);
  await app.listen(port);

  const address = (await app.getUrl()).replace('[::1]', 'localhost');
  console.log(`Swagger on: ${address}/docs`);
}

main();
