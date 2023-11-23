import { ConfigService } from '@nestjs/config';
import { Worker, Job } from 'bullmq';

async function setupDeleteWorker(configService: ConfigService) {
  const deleteWorker = new Worker(
    'delete',
    async (job: Job) => {
      console.log(`Processing job ${job.id}`);

      for (let i = 0; i < 30; i++) {
        job.updateProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      console.log(await job.getState());
      console.log(`Job ${job.id} completed`);
    },
    {
      concurrency: 1,
      connection: {
        host: configService.get<string>('REDIS_ADDRESS', 'localhost'),
        port: +configService.get<number>('REDIS_PORT', 6379),
      },
    },
  );

  deleteWorker.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed with error ${err.message}`);
  });

  deleteWorker.on('progress', (job, progress) => {
    if (typeof progress === 'number') {
      console.log(`Job ${job.id} is ${Math.round((progress * 100) / 30)}% done`);
    }
  });
}

export default setupDeleteWorker;