import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';

import { AbstractQueueService } from '../queue.service';

@Injectable()
export class QueuesDeleteService extends AbstractQueueService {
  constructor(configService: ConfigService) {
    const deleteQueue = new Queue('delete', {
      connection: {
        host: configService.get<string>('REDIS_ADDRESS', 'localhost'), // REDIS_ADDRESS
        port: configService.get<number>('REDIS_PORT', 6379), // REDIS_PORT
      },
    });
    super(deleteQueue);
  }
}
