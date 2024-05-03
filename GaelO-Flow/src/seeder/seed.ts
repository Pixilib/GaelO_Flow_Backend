import { exit } from 'process';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '../app.module';
import { SeederService } from './seeder.service';

const seeder = async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seedservice = app.get(SeederService);

  await seedservice.seed();
  await app.close();

  console.log('Seeding complete');
  exit(0);
};

seeder();
