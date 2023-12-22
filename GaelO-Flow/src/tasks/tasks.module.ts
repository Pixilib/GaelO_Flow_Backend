import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Option } from '../options/option.entity';
import { TasksService } from './tasks.service';
import { QueuesQueryService } from '../queues/query/queueQuery.service';

@Module({
  imports: [TypeOrmModule.forFeature([Option])],
  providers: [TasksService, QueuesQueryService],
  exports: [TasksService],
})
export class TasksModule {}