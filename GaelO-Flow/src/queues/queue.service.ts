import { Injectable } from '@nestjs/common';
import { Job, Queue } from 'bullmq';

@Injectable()
export abstract class AbstractQueueService {
  protected queue: Queue;

  constructor(queue: Queue) {
    this.queue = queue;
  }

  async addJob(data: object): Promise<void> {
    await this.queue.add(data['uuid'], data, {
      removeOnComplete: {
        age: 3600,
      },
      removeOnFail: {
        age: 24 * 3600,
      },
    });
  }

  async removeJob(data: object | undefined = undefined): Promise<void> {
    const jobs: Job<any, any, string>[] = await this.queue.getJobs();

    jobs.forEach((job) => {
      if (
        data == undefined ||
        ((job.data.uuid == data['uuid'] || data['uuid'] == undefined) &&
          (job.data.userId == data['userId'] || data['userId'] == undefined) &&
          (job.data.jobId == data['jobId'] || data['jobId'] == undefined))
      ) {
        this.queue.remove(job.id, { removeChildren: true });
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
      const stateJobs = await this.queue.getJobs(state as any);
      stateJobs.forEach((job) => {
        job.data.state = state;
        jobs.push(job);
      });
    }

    jobs = await Promise.all(
      jobs.map(async (job) => {
        return job;
      }),
    );

    const filteredJob = jobs.filter((job) => {
      return job.data.uuid == uuid || uuid == undefined;
    });

    return filteredJob;
  }

  async checkIfUserIdHasJobs(userId: number): Promise<boolean> {
    const jobs: Job<any, any, string>[] = await this.queue.getJobs();
    const result: Job | null = jobs.find((job) => job.data.userId == userId);

    return result ? true : false;
  }

  async getUuidOfUser(userId: number): Promise<string | null> {
    const jobs: Job<any, any, string>[] | null = await this.queue.getJobs();
    const uuid: string | null = jobs.find((job) => job.data.userId == userId)
      ?.data.uuid;

    return uuid ? uuid : null;
  }

  async getAllUuids(): Promise<string[]> {
    const jobs: Job<any, any, string>[] = await this.queue.getJobs();
    const uuids = jobs.map((job) => job.data.uuid);

    return Array.from(new Set(uuids));
  }

  async closeQueueConnection(): Promise<void> {
    await this.queue.close();
  }

  async flush(): Promise<void> {
    await this.queue.obliterate({ force: true });
  }

  async getJobsForUuid(uuid: string = undefined): Promise<object> {
    const jobs: Job<any, any, string>[] | null = await this.getJobs(uuid);

    const results = {};
    jobs
      .filter((job) => job.data.uuid == uuid || uuid == undefined)
      .forEach((job) => {
        const id = job.id;
        const progress = {
          Progress: job.progress,
          State: job.data.state,
          Id: job.id,
          Results: job.data.results,
          UserId: job.data.userId,
        };
        results[id] = progress;
      });

    return results;
  }
}
