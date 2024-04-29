import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Autorouting } from './autorouting.entity';
import { AutoroutingsService } from './autoroutings.service';
import { AutoroutingsController } from './autoroutings.controller';
import { AutoroutingHandler } from './autorouting.handler';
import OrthancClient from '../utils/orthanc-client';
import { ProcessingQueueService } from '../processing/processing-queue.service';

@Module({
  imports: [TypeOrmModule.forFeature([Autorouting])],
  providers: [
    AutoroutingsService,
    AutoroutingHandler,
    OrthancClient,
    ProcessingQueueService,
  ],
  controllers: [AutoroutingsController],
})
export class AutoroutingsModule {}
