import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Worker, Job, Queue } from 'bullmq';

@Injectable()
export class QueuesService {
  constructor(@InjectQueue('delete') private deleteQueue: Queue) {}

  async addDeleteJob(data: Object): Promise<void> {
    await this.deleteQueue.add(
      data['uuid'] + '_' + data['orthancSeriesId'],
      data,
      {
        removeOnComplete: {
          age: 3600,
        },
        removeOnFail: {
          age: 24 * 3600,
        },
        attempts: 5,
      },
    );
  }
  async removeDeleteJob(data: Object | undefined = undefined): Promise<void> {
    const jobs: Job<any, any, string>[] = await this.deleteQueue.getJobs();

    jobs.forEach((job) => {
      if (
        ((job.data.uuid == data['uuid'] || data['uuid'] == undefined) &&
          (job.data.userId == data['userId'] || data['userId'] == undefined) &&
          (job.data.jobId == data['jobId'] || data['jobId'] == undefined)) ||
        data == undefined
      ) {
        this.deleteQueue.remove(job.id, { removeChildren: true });
      }
    });
  }

  async getJobs(
    uuid: string | undefined = undefined,
  ): Promise<Job<any, any, string>[]> {
    const jobs: Job<any, any, string>[] = await this.deleteQueue.getJobs();
    let jobArray: Job[] = [];

    jobs.forEach((job) => {
      if (job.data.uuid == uuid || uuid == undefined) {
        jobArray.push(job);
      }
    });
    return jobArray;
  }

  async checkIfUserIdHasJobs(userId: number): Promise<boolean> {
    const jobs: Job<any, any, string>[] = await this.deleteQueue.getJobs();
    let result: boolean = false;

    jobs.forEach((job) => {
      if (job.data.userId == userId) {
        result = true;
      }
    });

    return result;
  }

  async getJobProgress(jobId: string): Promise<Object | null> {
    const job = await this.deleteQueue.getJob(jobId.toString());

    if (job) {
      return {
        progress: job.progress,
        state: await job.getState(),
        id: job.id,
      };
    } else {
      return null;
    }
  }

  public async seed() {
    const jobs: Job<any, any, string>[] = await this.deleteQueue.getJobs();

    jobs.forEach((job) => {
      this.deleteQueue.remove(job.id, { removeChildren: true });
    });
  }
}
