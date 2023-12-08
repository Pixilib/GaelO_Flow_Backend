import { Injectable } from '@nestjs/common';
import { AbstractQueueService } from '../queue.service';
import { InjectQueue} from '@nestjs/bullmq';
import { Queue } from 'bullmq';


@Injectable()
export class QueuesQueryService extends AbstractQueueService {
  constructor(@InjectQueue('query') queryQueue: Queue) {
    super(queryQueue);
  }
}
