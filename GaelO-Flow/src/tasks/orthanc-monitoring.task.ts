import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';

import OrthancClient from '../utils/orthanc-client';
/**
 * CronJob checking for Orthanc Events using HTTP /changes API and emitting events to other GaelO-Flow backend services.
 */
@Injectable()
export class OrthancMonitoringTask {
  private lastChanges: number = null;

  constructor(
    private orthancClient: OrthancClient,
    private eventEmitter: EventEmitter2,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async orthancMonitoringCron() {
    if (this.lastChanges === null) {
      this.lastChanges = (await this.orthancClient.getLastChanges()).Last;
    }

    const changes = await this.orthancClient.getChangesSince(
      this.lastChanges.toString(),
    );

    this.lastChanges = changes.Last;
    changes.Changes.forEach((element: any) => {
      this.eventEmitter.emit('orthanc.' + element.ChangeType, element);
    });
  }
}
