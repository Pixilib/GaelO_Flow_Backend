import { Injectable } from '@nestjs/common';
import { AbstractQueueService } from '../queue.service';
import { InjectQueue} from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class QueuesQueryService extends AbstractQueueService {
  constructor(private configService: ConfigService) {
    // console.log('config', configService.get<string>('REDIS_ADDRESS', 'localhost'), configService.get<number>('REDIS_PORT', 6379));
    const queryQueue = new Queue('query', {
      connection: {
        host: configService.get<string>('REDIS_ADDRESS', 'localhost'), // REDIS_ADDRESS
        port: configService.get<number>('REDIS_PORT', 6379), // REDIS_PORT
      },
    })
    super(queryQueue);
  }
}
