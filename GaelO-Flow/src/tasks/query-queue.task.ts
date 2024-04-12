import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { Option } from '../options/option.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueuesQueryService } from '../queues/query/queue-query.service';
import { isTimeBetween } from '../utils/is-time-between';
import OrthancClient from '../utils/orthanc-client';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class QueryQueueTask {
  constructor(
    @InjectRepository(Option)
    private optionRepository: Repository<Option>,
    private queueQueryService: QueuesQueryService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async queryQueueCron() {
    const options: Option = (await this.optionRepository.find())[0];
    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();
    const isBetween = isTimeBetween(
      options.AutoQueryHourStart,
      options.AutoQueryMinuteStart,
      options.AutoQueryHourStop,
      options.AutoQueryMinuteStop,
      currentHour,
      currentMinute,
    );
    const queueState = await this.queueQueryService.isPaused();

    if (queueState && isBetween) {
      await this.queueQueryService.resume();
    } else if (!queueState && !isBetween) {
      await this.queueQueryService.pause();
    }
  }
}
