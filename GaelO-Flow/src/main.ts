import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import OrthancClient from './orthanc/OrthancClient';
import setupDeleteWorker from './queues/delete/deleteWorker';
import setupAnonWorker from './queues/anon/anonWorker';
import setupQueryWorker from './queues/query/queryWorker';

async function main() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
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
  const orthancClient = app.get(OrthancClient)
  const port = configService.get<number>('API_PORT', 3000);
  await setupDeleteWorker(orthancClient);
  await setupAnonWorker(orthancClient);
  await setupQueryWorker(orthancClient);
  await app.listen(port);

  const address = (await app.getUrl()).replace('[::1]', 'localhost');
  console.log(`Running on: ${address}/api`);
}

main();
