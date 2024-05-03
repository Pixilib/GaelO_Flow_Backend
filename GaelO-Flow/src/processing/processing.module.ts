import { Module } from '@nestjs/common';
import { ProcessingController } from './processing.controller';
import { ProcessingQueueService } from './processing-queue.service';

@Module({
  imports: [],
  providers: [ProcessingQueueService],
  controllers: [ProcessingController],
})
export class ProcessingModule {}
