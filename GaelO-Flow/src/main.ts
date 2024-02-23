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
import OrthancClient from './orthanc/OrthancClient';
import setupDeleteWorker from './queues/delete/deleteWorker';
import setupAnonWorker from './queues/anon/anonWorker';
import setupQueryWorker from './queues/query/queryWorker';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { OauthConfigService } from './oauth_configs/oauth_configs.service';

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
            authorizationUrl: config.url,
            scopes: { openid: 'openid' },
          },
        },
      },
      // config.provider,
      'oauth2', // won't work unless this is 'oauth2', but only one can be 'oauth2'
    );
  });

  const config = documentBuilder.build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);
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

  const configService = app.get(ConfigService);
  const orthancClient = app.get(OrthancClient);
  setupDeleteWorker(orthancClient, configService);
  setupAnonWorker(orthancClient, configService);
  setupQueryWorker(orthancClient, configService);

  const port = configService.get<number>('API_PORT', 3000);

  await buildSwagger(app);
  await app.listen(port);
  const address = (await app.getUrl()).replace('[::1]', 'localhost');
  console.log(`Swagger on: ${address}/docs`);
}

main();
