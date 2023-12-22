import { Worker, Job } from 'bullmq';
import OrthancClient from '../../orthanc/OrthancClient';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

async function processStudy(orthancClient: OrthancClient, job: Job) {
  job.updateProgress(0);
  const queryDetails = await orthancClient.queryStudiesInAet(
    job.data.study.patientName,
    job.data.study.patientID,
    job.data.study.studyDate,
    job.data.study.modalities,
    job.data.study.studyDescription,
    job.data.study.accessionNb,
    job.data.study.studyInstanceUID,
    job.data.study.aet);

  if (queryDetails.length != 1) {
    job.failedReason = `Query returned ${queryDetails.length} results, expected 1`;
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
    request.data.Query[0]['0020,000d'],
  );
  const orthancResult = orthancResults.data[0];
  job.updateData({ ...job.data, results: orthancResult });
  job.updateProgress(100);
}

async function processSeries(orthancClient: OrthancClient, job: Job) {
  job.updateProgress(0);
  const seriesDetails = await orthancClient.querySeriesInAet(
    job.data.series.studyUID,
    job.data.series.modalities,
    job.data.series.protocolName,
    job.data.series.seriesDescription,
    job.data.series.seriesNumber,
    job.data.series.seriesInstanceUID,
    job.data.series.aet);

  if (seriesDetails.length != 1) {
      job.failedReason = `Query returned ${seriesDetails.length} results, expected 1`;
  }
  const serieDetails = seriesDetails[0];
  job.updateProgress(10);
  const request = await orthancClient.makeRetrieve(
    serieDetails.AnswerId,
    serieDetails.AnswerNumber,
    serieDetails.OriginAET,
    true,
  );
  const orthancResults = await orthancClient.findInOrthancBySeriesInstanceUID(
    request.data.Query[0]['0020,000e'],
  );
  const orthancResult = orthancResults.data[0];
  job.updateData({ ...job.data, results: orthancResult });
  job.updateProgress(100);
}

function setupQueryWorker(
  orthancClient: OrthancClient,
  configService: ConfigService,
) {
  const redisHost = configService.get('REDIS_ADDRESS', 'localhost');
  const redisPort = configService.get('REDIS_PORT', 6379);
  const connectionString = 'redis://' + redisHost + ':' + redisPort;
  const redis = new Redis(connectionString, { maxRetriesPerRequest: null });
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
}

export default setupQueryWorker;
