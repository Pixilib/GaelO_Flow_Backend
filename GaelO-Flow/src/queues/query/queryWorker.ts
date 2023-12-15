import { Worker, Job } from 'bullmq';
import OrthancClient from '../../orthanc/OrthancClient';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

async function processStudy(orthancClient: OrthancClient, job: Job) {
  job.updateProgress(0);
  const queryDetails = await orthancClient.queryStudiesInAet(job.data);

  if (queryDetails.length != 1) {
    throw new Error(
      `Query returned ${queryDetails.length} results, expected 1`,
    );
  }

  const studyDetails = queryDetails[0];

  job.updateProgress(10);
  const request = await orthancClient.makeRetrieve(
    studyDetails.AnswerId,
    studyDetails.AnswerNumber,
    studyDetails.OriginAET,
    true,
  );
  const orthancResults = await orthancClient.findInOrthancByStudyInstanceUID(
    request.data['0020,000d'],
  );
  //Une fois fini stocker l'ID de la ressource orthanc recupérer dans les resultats du job
  orthancResults[0].ID;
  job.updateProgress(100);
}

function processSeries(orthancClient: OrthancClient, job: Job) {
  job.updateProgress(0);
  const seriesDetails = orthancClient.querySeriesInAet(job.data);
  job.updateProgress(10);
}

function setupQueryWorker(
  orthancClient: OrthancClient,
  configService: ConfigService,
) {
  const redisHost = configService.get('REDIS_ADDRESS', 'localhost');
  const redisPort = configService.get('REDIS_PORT', 6379);
  const connectionString = 'redis://' + redisHost + ':' + redisPort;
  const redis = new Redis(connectionString);
  const queryWorker = new Worker(
    'query',
    async (job: Job) => {
      if (job.data.series) processSeries(orthancClient, job);
      if (job.data.study) processStudy(orthancClient, job);
    },
    { connection: redis },
  );

  queryWorker.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed with error ${err.message}`);
  });

  queryWorker.on('progress', (job, progress) => {});
}

export default setupQueryWorker;
