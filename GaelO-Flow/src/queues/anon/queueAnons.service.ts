import { Injectable } from '@nestjs/common';
import { AbstractQueueService } from '../queue.service';
import { InjectQueue} from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class QueuesAnonService extends AbstractQueueService {
  constructor(private configService: ConfigService) {
    const anonQueue = new Queue('anon', {
      connection: {
        host: configService.get<string>('REDIS_ADDRESS', 'localhost'), // REDIS_ADDRESS
        port: configService.get<number>('REDIS_PORT', 6379), // REDIS_PORT
      },
    })
    super(anonQueue);
  }
}
