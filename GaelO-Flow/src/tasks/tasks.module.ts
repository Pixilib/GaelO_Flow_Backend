import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Option } from '../options/option.entity';
import { QueuesQueryService } from '../queues/query/queue-query.service';
import OrthancClient from '../utils/orthanc-client';
import { QueryQueueTask } from './query-queue.task';
import { OrthancMonitoringTask } from './orthanc-monitoring.task';

@Module({
  imports: [TypeOrmModule.forFeature([Option])],
  providers: [
    QueuesQueryService,
    OrthancClient,
    QueryQueueTask,
    OrthancMonitoringTask,
  ],
  exports: [QueryQueueTask, OrthancMonitoringTask],
})
export class TasksModule {}
