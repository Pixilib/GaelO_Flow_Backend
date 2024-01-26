import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedService } from './seeder.service';
import { exit } from 'process';

const seeder = async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seedservice = app.get(SeedService);

  await seedservice.seed();
  await app.close();

  console.log('Seeding complete');
  exit(0);
};

seeder();
