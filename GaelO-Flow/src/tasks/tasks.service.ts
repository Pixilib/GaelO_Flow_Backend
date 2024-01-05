import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { Option } from '../options/option.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueuesQueryService } from '../queues/query/queueQuery.service';
import { isTimeBetween } from '../utils/dateIntervals';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Option)
    private optionRepository: Repository<Option>,
    private queueQueryService: QueuesQueryService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async queryQueueCron() {
    const options: Option = (await this.optionRepository.find())[0];
    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();
    const isBetween = isTimeBetween(
      options.autoQueryHourStart,
      options.autoQueryMinuteStart,
      options.autoQueryHourStop,
      options.autoQueryMinuteStop,
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
