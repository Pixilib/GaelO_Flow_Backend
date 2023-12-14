import { Worker, Job, RedisConnection } from 'bullmq';
import OrthancClient from '../../orthanc/OrthancClient';
import { ConfigService } from '@nestjs/config';

import Redis from 'ioredis';

async function setupDeleteWorker(
  orthancClient: OrthancClient,
  configService: ConfigService,
) {
  const redisHost = configService.get('REDIS_ADDRESS', 'localhost');
  const redisPort = configService.get('REDIS_PORT', 6379);
  const connectionString = 'redis://' + redisHost + ':' + redisPort;
  const redis = new Redis(connectionString);
  // console.log(await redis.info())
  const deleteWorker = new Worker(
    'delete',
    async (job: Job) => {
      job.updateProgress(0);
      await orthancClient.deleteFromOrthanc('series', job.data.orthancSeriesId);
      job.updateProgress(100);
    },
    { connection: redis },
  );

  deleteWorker.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed with error ${err.message}`);
  });

  deleteWorker.on('progress', (job, progress) => {});
}

export default setupDeleteWorker;
