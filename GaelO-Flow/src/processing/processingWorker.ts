import { Worker, Job } from 'bullmq';
import OrthancClient from '../orthanc/OrthancClient';
import { TmtvService } from './tmtv.service';
import { ConfigService } from '@nestjs/config';

import Redis from 'ioredis';
import ProcessingClient from './ProcessingClient';
import { ProcessingMaskEnum } from './processingMask.enum';

async function TmtvWorker(
  orthancClient: OrthancClient,
  configService: ConfigService,
  processingClient: ProcessingClient,
) {
  const redisHost = configService.get('REDIS_ADDRESS', 'localhost');
  const redisPort = configService.get('REDIS_PORT', 6379);
  const connectionString = 'redis://' + redisHost + ':' + redisPort;
  const redis = new Redis(connectionString, { maxRetriesPerRequest: null });
  const TmtvWorker = new Worker(
    'processing',
    async (job: Job) => {
      const tmtvService = new TmtvService(orthancClient, processingClient);
      const ctOrthancSeriesId: string = job.data.ctOrthancSeriesId;
      const ptOrthancSeriesId: string = job.data.ptOrthancSeriesId;
      const sendMaskToOrthancAs: ProcessingMaskEnum =
        job.data.sendMaskToOrthancAs;
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

      if (sendMaskToOrthancAs == ProcessingMaskEnum.SEG) {
        await tmtvService.sendMaskAsSegToOrthanc();
      } else if (sendMaskToOrthancAs == ProcessingMaskEnum.RTSS) {
        await tmtvService.sendMaskAsRtssToOrthanc();
      } else {
        throw new Error('Invalid mask type');
      }
      job.updateProgress(80);

      await tmtvService.deleteAllRessources();
      job.updateProgress(100);
    },
    { connection: redis },
  );

  TmtvWorker.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed with error ${err.message}`);
  });
}

export default TmtvWorker;
