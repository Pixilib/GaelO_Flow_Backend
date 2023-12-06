import { Injectable } from '@nestjs/common';
import { AbstractQueueService } from '../queue.service';
import { InjectQueue} from '@nestjs/bullmq';
import { Queue } from 'bullmq';


@Injectable()
export class QueuesDeleteService extends AbstractQueueService {
  constructor(@InjectQueue('delete') deleteQueue: Queue) {
    super(deleteQueue);
  }
}
