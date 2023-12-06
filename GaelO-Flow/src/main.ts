import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import setupDeleteWorker from './queues/delete/deleteWorker';

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
  const port = configService.get<number>('API_PORT', 3000);
  await setupDeleteWorker(configService);
  await app.listen(port);

  const address = (await app.getUrl()).replace('[::1]', 'localhost');
  console.log(`Running on: ${address}`);
}

main();
