import { Worker, Job } from 'bullmq';
import OrthancClient from '../orthanc/OrthancClient';
import { ConfigService } from '@nestjs/config';

import Redis from 'ioredis';

async function TmtvInference(
  orthancClient: OrthancClient,
  configService: ConfigService,
) {
  const redisHost = configService.get('REDIS_ADDRESS', 'localhost');
  const redisPort = configService.get('REDIS_PORT', 6379);
  const connectionString = 'redis://' + redisHost + ':' + redisPort;
  const redis = new Redis(connectionString, { maxRetriesPerRequest: null });
  const tmtvInferenceWorker = new Worker(
    'processing',
    async (job: Job) => {
      job.updateProgress(0);

      // TODO: Implement TMTV Inference

      job.updateProgress(100);
    },
    { connection: redis },
  );

  tmtvInferenceWorker.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed with error ${err.message}`);
  });
}

export default TmtvInference;
