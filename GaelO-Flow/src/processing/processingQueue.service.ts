import { ConfigService } from '@nestjs/config';
import { Job, Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class ProcessingQueueService {
  private processingQueue: Queue;

  constructor(private readonly configService: ConfigService) {
    this.processingQueue = new Queue('processing', {
      connection: {
        host: this.configService.get<string>('REDIS_ADDRESS', 'localhost'),
        port: this.configService.get<number>('REDIS_PORT', 6379),
      },
    });
    this.processingQueue.resume();
  }

  async flush(): Promise<void> {
    await this.processingQueue.obliterate({ force: true });
  }

  async removeJob(jobData: object): Promise<void> {
    console.log(jobData);
  }

  async addJob(jobData: object): Promise<string> {
    const jobId = randomUUID();
    const user = jobData['user'];
    const newProcessingJobDto = jobData['newProcessingJobDto'];

    const data = {
      ...newProcessingJobDto,
      userId: user.userId,
    };

    this.processingQueue.add(jobId, data, {
      jobId: jobId,
    });

    return jobId;
  }

  async getJobs(
    userId: Number = undefined,
    jobId: String = undefined,
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
      const stateJobs = await this.processingQueue.getJobs(state as any);
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
      return (
        (job.data.userId == userId || userId == undefined) &&
        (job.id == jobId || jobId == undefined)
      );
    });

    return filteredJob;
  }

  async getJobIdsOfUser(userId: number) {
    const jobs: Job<any, any, string>[] = await this.getJobs();
    const ids = jobs
      .filter((job) => job.data.userId == userId)
      .map((job) => job.id);

    return ids;
  }
}