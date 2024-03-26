import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { Option } from '../options/option.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueuesQueryService } from '../queues/query/queueQuery.service';
import { isTimeBetween } from '../utils/dateIntervals';
import OrthancClient from 'src/orthanc/OrthancClient';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class TasksService {
  private lastChanges: Number = 0;

  constructor(
    @InjectRepository(Option)
    private optionRepository: Repository<Option>,
    private queueQueryService: QueuesQueryService,
    private orthancClient: OrthancClient,
    private eventEmitter: EventEmitter2,
  ) {
    (async () => {
      this.lastChanges = (await this.orthancClient.getLastChanges()).data.Last;
    })();
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
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

  @Cron(CronExpression.EVERY_10_SECONDS)
  async orthancMonitoringCron() {
    const changes = (
      await this.orthancClient.getChangesSince(this.lastChanges.toString())
    ).data;

    this.lastChanges = changes.Last;
    changes.Changes.forEach((element: any) => {
      this.eventEmitter.emit('orthanc.' + element.ChangeType, element);
    });
  }

  // @OnEvent('orthanc.*')
  // handleOrderCreatedEvent(payload: any) {
  //   console.log('orthanc: ', payload);
  // }
}
