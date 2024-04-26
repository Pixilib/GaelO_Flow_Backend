import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';

import OrthancClient from '../utils/orthanc-client';

@Injectable()
export class OrthancMonitoringTask {
  private lastChanges: number = null;

  constructor(
    private orthancClient: OrthancClient,
    private eventEmitter: EventEmitter2,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async orthancMonitoringCron() {
    if (this.lastChanges === null) {
      this.lastChanges = (await this.orthancClient.getLastChanges()).data.Last;
    }

    const changes = (
      await this.orthancClient.getChangesSince(this.lastChanges.toString())
    ).data;

    this.lastChanges = changes.Last;
    changes.Changes.forEach((element: any) => {
      this.eventEmitter.emit('orthanc.' + element.ChangeType, element);
    });
  }
}
