import { Injectable } from '@nestjs/common';
import { AbstractQueueService } from '../queue.service';
import { InjectQueue} from '@nestjs/bullmq';
import { Queue } from 'bullmq';


@Injectable()
export class QueuesAnonService extends AbstractQueueService {
  constructor(@InjectQueue('anon') anonQueue: Queue) {
    super(anonQueue);
  }
}
