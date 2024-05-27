import { ConfigService } from '@nestjs/config';
import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';

import OrthancClient from '../../utils/orthanc-client';

function isSecondaryCapture(sopClassUid: string) {
  const secondaryCapturySopClass = [
    '1.2.840.10008.5.1.4.1.1.7',
    '1.2.840.10008.5.1.4.1.1.7.1',
    '1.2.840.10008.5.1.4.1.1.7.2',
    '1.2.840.10008.5.1.4.1.1.7.3',
    '1.2.840.10008.5.1.4.1.1.7.4',
    '1.2.840.10008.5.1.4.1.1.88.11',
    '1.2.840.10008.5.1.4.1.1.88.22',
    '1.2.840.10008.5.1.4.1.1.88.33',
    '1.2.840.10008.5.1.4.1.1.88.40',
    '1.2.840.10008.5.1.4.1.1.88.50',
    '1.2.840.10008.5.1.4.1.1.88.59',
    '1.2.840.10008.5.1.4.1.1.88.65',
    '1.2.840.10008.5.1.4.1.1.88.67',
  ];

  return secondaryCapturySopClass.includes(sopClassUid);
}
/**
 *  Definition and redis connexion of the anonymization job.
 * @param orthancClient
 * @param configService
 */
function setupAnonWorker(
  orthancClient: OrthancClient,
  configService: ConfigService,
) {
  const redisHost = configService.get('REDIS_ADDRESS', 'localhost');
  const redisPort = configService.get('REDIS_PORT', 6379);
  const connectionString = 'redis://' + redisHost + ':' + redisPort;
  const redis = new Redis(connectionString, { maxRetriesPerRequest: null });

  const anonWorker = new Worker(
    'anon',
    async (job: Job) => {
      job.updateProgress(0);
      const anonAnswer = await orthancClient.anonymize(
        'studies',
        job.data.anonymize.orthancStudyID,
        job.data.anonymize.profile,
        job.data.anonymize.newAccessionNumber,
        job.data.anonymize.newPatientID,
        job.data.anonymize.newPatientName,
        job.data.anonymize.newStudyDescription,
      );
      job.updateProgress(50);
      const studyDetails = await orthancClient.getOrthancDetails(
        'studies',
        anonAnswer.ID,
      );
      job.updateData({ ...job.data, results: studyDetails });
      for (const seriesOrthancID of studyDetails.Series) {
        const seriesDetails = await orthancClient.getOrthancDetails(
          'series',
          seriesOrthancID,
        );
        const firstInstanceID = seriesDetails.Instances[0];
        try {
          const sopClassUID =
            await orthancClient.getSopClassUID(firstInstanceID);
          if (isSecondaryCapture(sopClassUID)) {
            await orthancClient.deleteFromOrthanc('series', seriesOrthancID);
          }
        } catch (error) {
          console.error(error);
        }
      }
      job.updateProgress(100);
    },
    { connection: redis },
  );

  anonWorker.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed with error ${err.message}`);
  });
}

export default setupAnonWorker;
