import { ConfigService } from '@nestjs/config';
import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';

import OrthancClient from '../../utils/orthanc-client';

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
    job.data.study.aet,
  );

  if (queryDetails.length != 1) {
    job.failedReason = `Query returned ${queryDetails.length} results, expected 1`;
  }
  const studyDetails = queryDetails[0];
  job.updateProgress(10);
  const data = await orthancClient.makeRetrieve(
    studyDetails.AnswerId,
    studyDetails.AnswerNumber,
    studyDetails.OriginAET,
    true,
  );
  const orthancResults = await orthancClient.findInOrthancByStudyInstanceUID(
    data.Query[0]['0020,000d'],
  );
  job.updateData({ ...job.data, results: orthancResults[0] });
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
    job.data.series.aet,
  );

  if (seriesDetails.length != 1) {
    job.failedReason = `Query returned ${seriesDetails.length} results, expected 1`;
  }
  const serieDetails = seriesDetails[0];
  job.updateProgress(10);
  const data = await orthancClient.makeRetrieve(
    serieDetails.AnswerId,
    serieDetails.AnswerNumber,
    serieDetails.OriginAET,
    true,
  );
  const orthancResults = await orthancClient.findInOrthancBySeriesInstanceUID(
    data.Query[0]['0020,000e'],
  );
  job.updateData({ ...job.data, results: orthancResults[0] });
  job.updateProgress(100);
}

/**
 * Definition and redis connexion of the query job.
 * @param orthancClient
 * @param configService
 */
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
