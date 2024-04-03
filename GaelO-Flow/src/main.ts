import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  INestApplication,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import OrthancClient from './orthanc/orthanc-client';
import setupDeleteWorker from './queues/delete/delete.worker';
import setupAnonWorker from './queues/anon/anon.worker';
import setupQueryWorker from './queues/query/query.worker';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { OauthConfigService } from './oauth_configs/oauth-configs.service';
import setupProcessingWorker from './processing/processing.worker';
import ProcessingClient from './processing/processing.client';

async function buildSwagger(app: INestApplication<any>) {
  const oauthConfigs = await app.get(OauthConfigService).getOauthConfig();
  const documentBuilder = new DocumentBuilder()
    .setTitle('GaelO Flow API')
    .setDescription('The GaelO Flow API description')
    .setVersion('2.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    );

  oauthConfigs.forEach((config) => {
    documentBuilder.addOAuth2(
      {
        type: 'oauth2',
        flows: {
          implicit: {
            authorizationUrl: config.AuthorizationUrl,
            scopes: { openid: 'openid', profile: 'profile', email: 'email' },
          },
        },
      },
      // config.Provider,
      'oauth2',
    );
  });

  const config = documentBuilder.build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);
}

async function setupWorkers(app: INestApplication<any>) {
  const orthancClient = app.get(OrthancClient);
  const configService = app.get(ConfigService);
  const processingClient = app.get(ProcessingClient);
  setupDeleteWorker(orthancClient, configService);
  setupAnonWorker(orthancClient, configService);
  setupQueryWorker(orthancClient, configService);
  setupProcessingWorker(orthancClient, configService, processingClient);
}

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

  await setupWorkers(app);

  const port = app.get(ConfigService).get<number>('API_PORT', 3000);

  await buildSwagger(app);
  await app.listen(port);
  const address = (await app.getUrl()).replace('[::1]', 'localhost');
  console.log(`Swagger on: ${address}/docs`);
}

main();
