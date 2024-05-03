import { Module } from '@nestjs/common';
import { QueuesAnonController } from './anon/queue-anons.controller';
import { QueuesDeleteController } from './delete/queue-deletes.controller';
import { QueuesQueryController } from './query/queue-query.controller';
import { QueuesAnonService } from './anon/queue-anons.service';
import { QueuesDeleteService } from './delete/queue-deletes.service';
import { QueuesQueryService } from './query/queue-query.service';

@Module({
  imports: [],
  providers: [QueuesAnonService, QueuesDeleteService, QueuesQueryService],
  controllers: [
    QueuesAnonController,
    QueuesDeleteController,
    QueuesQueryController,
  ],
})
export class QueueModule {}
