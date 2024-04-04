import { Injectable } from '@nestjs/common';
import { AbstractQueueService } from '../queue.service';
import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QueuesQueryService extends AbstractQueueService {
  constructor(configService: ConfigService) {
    const queryQueue = new Queue('query', {
      connection: {
        host: configService.get<string>('REDIS_ADDRESS', 'localhost'), // REDIS_ADDRESS
        port: configService.get<number>('REDIS_PORT', 6379), // REDIS_PORT
      },
    });
    queryQueue.pause();
    super(queryQueue);
  }

  async pause(): Promise<void> {
    await this.queue.pause();
  }

  async resume(): Promise<void> {
    await this.queue.resume();
  }

  async isPaused(): Promise<boolean> {
    return await this.queue.isPaused();
  }
}
