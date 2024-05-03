import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessingController } from './processing.controller';
import { ProcessingQueueService } from './processing-queue.service';

@Module({
  imports: [],
  providers: [ProcessingQueueService],
  controllers: [ProcessingController],
})
export class ProcessingModule {}
