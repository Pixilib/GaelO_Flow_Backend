import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { Worker, Job } from 'bullmq';

import OrthancClient from '../utils/orthanc-client';
import ProcessingClient from '../utils/processing.client';
import { TmtvService } from './tmtv.service';
import { ProcessingJobType, ProcessingMask } from '../constants/enums';

async function tmtvJob(
  job: Job,
  orthancClient: OrthancClient,
  processingClient: ProcessingClient,
) {
  const tmtvService = new TmtvService(orthancClient, processingClient);
  const ctOrthancSeriesId: string = job.data.ctOrthancSeriesId;
  const ptOrthancSeriesId: string = job.data.ptOrthancSeriesId;
  const sendMaskToOrthancAs: ProcessingMask = job.data.sendMaskToOrthancAs;
  const withFragmentedMask: boolean =
    job.data.withFragmentedMask == undefined
      ? false
      : job.data.withFragmentedMask;

  tmtvService.setCtOrthancSeriesId(ctOrthancSeriesId);
  tmtvService.setPtOrthancSeriesId(ptOrthancSeriesId);

  job.updateProgress(0);

  await tmtvService.sendDicomToProcessing();
  job.updateProgress(20);

  await tmtvService.createSeries();
  job.updateProgress(40);

  await tmtvService.runInference(withFragmentedMask);
  job.updateProgress(60);

  if (sendMaskToOrthancAs == ProcessingMask.SEG) {
    await tmtvService.sendMaskAsSegToOrthanc();
  } else if (sendMaskToOrthancAs == ProcessingMask.RTSS) {
    await tmtvService.sendMaskAsRtssToOrthanc();
  } else {
    throw new Error('Invalid mask type');
  }
  job.updateProgress(80);

  await tmtvService.deleteAllRessources();
  job.updateProgress(100);
}

async function setupProcessingWorker(
  orthancClient: OrthancClient,
  configService: ConfigService,
  processingClient: ProcessingClient,
) {
  const redisHost = configService.get('REDIS_ADDRESS', 'localhost');
  const redisPort = configService.get('REDIS_PORT', 6379);
  const connectionString = 'redis://' + redisHost + ':' + redisPort;
  const redis = new Redis(connectionString, { maxRetriesPerRequest: null });
  const processingWorker = new Worker(
    'processing',
    async (job: Job) => {
      const jobType = job.data.JobType;

      switch (jobType) {
        case ProcessingJobType.TMTV:
          await tmtvJob(job, orthancClient, processingClient);
          break;
        default:
          throw new Error('Invalid job type');
      }
    },
    {
      connection: redis,
    },
  );

  processingWorker.on('failed', (job, err) => {
    console.error(`Processing Job ${job.id} failed with error ${err.message}`);
  });
}

export default setupProcessingWorker;
