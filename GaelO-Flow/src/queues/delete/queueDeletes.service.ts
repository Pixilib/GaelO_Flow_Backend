import { Injectable } from '@nestjs/common';
import { AbstractQueueService } from '../queue.service';
import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QueuesDeleteService extends AbstractQueueService {
  constructor(private configService: ConfigService) {
    const deleteQueue = new Queue('delete', {
      connection: {
        host: configService.get<string>('REDIS_ADDRESS', 'localhost'), // REDIS_ADDRESS
        port: configService.get<number>('REDIS_PORT', 6379), // REDIS_PORT
      },
    });
    super(deleteQueue);
  }
}
