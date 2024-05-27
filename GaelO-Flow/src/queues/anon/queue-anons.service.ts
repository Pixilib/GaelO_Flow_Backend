import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Queue } from 'bullmq';
import { AbstractQueueService } from '../queue.service';
/**
 * implementation of the anonymization queue service.
 */
@Injectable()
export class QueuesAnonService extends AbstractQueueService {
  constructor(configService: ConfigService) {
    const anonQueue = new Queue('anon', {
      connection: {
        host: configService.get<string>('REDIS_ADDRESS', 'localhost'), // REDIS_ADDRESS
        port: configService.get<number>('REDIS_PORT', 6379), // REDIS_PORT
      },
    });
    super(anonQueue);
  }
}
