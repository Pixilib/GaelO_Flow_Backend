import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Worker, Job, Queue } from 'bullmq';

@Injectable()
export class QueuesDeleteService {
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
      },
    );
  }
  async removeDeleteJob(data: Object | undefined = undefined): Promise<void> {
    const jobs: Job<any, any, string>[] = await this.deleteQueue.getJobs();

    jobs.forEach((job) => {
      if (
        data == undefined ||
        ((job.data.uuid == data['uuid'] || data['uuid'] == undefined) &&
          (job.data.userId == data['userId'] || data['userId'] == undefined) &&
          (job.data.jobId == data['jobId'] || data['jobId'] == undefined))
      ) {
        this.deleteQueue.remove(job.id, { removeChildren: true });
      }
    });
  }

  async getJobs(
    uuid: string | undefined = undefined,
  ): Promise<Job<any, any, string>[]> {
    const states = [
      'completed',
      'failed',
      'delayed',
      'active',
      'wait',
      'waiting-children',
      'prioritized',
      'paused',
      'repeat',
    ];
    let jobs = [];

    for (const state of states) {
      const stateJobs = await this.deleteQueue.getJobs(state as any);
      stateJobs.forEach(job => {
        job.data.state = state;
        jobs.push(job);
      });
    }
  
    jobs = await Promise.all(jobs.map(async (job) => {
      return job;
    }));
  
    const filteredJob = jobs.filter((job) => {
      return job.data.uuid == uuid || uuid == undefined;
    });

    return filteredJob;
  }

  async checkIfUserIdHasJobs(userId: number): Promise<boolean> {
    const jobs: Job<any, any, string>[] = await this.deleteQueue.getJobs();
    let result: Job | null = jobs.find((job) => job.data.userId == userId)
    
    return result ? true : false;
  }

  // async getJobProgress(jobId: string): Promise<Object | null> {
  //   const job = await this.deleteQueue.getJob(jobId.toString());
  //   if (job) {
  //     return {
  //       progress: job.progress,
  //       state: await job.getState(),
  //       id: job.id,
  //     };
  //   } else {
  //     return null;
  //   }
  // }

  async getUuidOfUser(userId: number): Promise<string | null> {
    const jobs: Job<any, any, string>[] | null =
      await this.deleteQueue.getJobs();
    const uuid: string | null = jobs.find((job) => job.data.userId == userId)
      ?.data.uuid;

    return uuid ? uuid : null;
  }

  async closeQueueConnection(): Promise<void> {
    await this.deleteQueue.close();
  }

  public async seed() {
    const jobs: Job<any, any, string>[] = await this.deleteQueue.getJobs();

    jobs.forEach((job) => {
      this.deleteQueue.remove(job.id, { removeChildren: true });
    });
  }
}
