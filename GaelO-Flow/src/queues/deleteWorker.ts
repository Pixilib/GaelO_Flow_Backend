import { Worker, Job } from 'bullmq';

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
    connection: {
      host: 'localhost',
      port: 6379,
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
