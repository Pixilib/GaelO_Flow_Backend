import { ConfigService } from '@nestjs/config';
import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';

import OrthancClient from '../../utils/orthanc-client';
/**
 * Definition and redis connexion of the delete job.
 * @param orthancClient
 * @param configService
 */
async function setupDeleteWorker(
  orthancClient: OrthancClient,
  configService: ConfigService,
) {
  const redisHost = configService.get('REDIS_ADDRESS', 'localhost');
  const redisPort = configService.get('REDIS_PORT', 6379);
  const connectionString = 'redis://' + redisHost + ':' + redisPort;
  const redis = new Redis(connectionString, { maxRetriesPerRequest: null });
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
}

export default setupDeleteWorker;
