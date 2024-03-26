import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Option } from '../options/option.entity';
import { TasksService } from './tasks.service';
import { QueuesQueryService } from '../queues/query/queueQuery.service';
import OrthancClient from 'src/orthanc/OrthancClient';

@Module({
  imports: [TypeOrmModule.forFeature([Option])],
  providers: [TasksService, QueuesQueryService, OrthancClient],
  exports: [TasksService],
})
export class TasksModule {}
