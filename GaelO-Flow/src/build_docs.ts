import { writeFileSync } from 'fs';
import { exit } from 'process';

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

const buildDocs = async () => {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('GaelO Flow API')
    .setDescription('The GaelO Flow API description')
    .setVersion('2.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  writeFileSync('../openapi.json', JSON.stringify(document));
  await app.close();
  console.log('Documentation built -> openapi.json');
  exit(0);
};

buildDocs();
