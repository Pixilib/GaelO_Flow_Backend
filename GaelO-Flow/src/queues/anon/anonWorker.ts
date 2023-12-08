import { Worker, Job } from 'bullmq';
import OrthancClient from '../../orthanc/OrthancClient';

async function setupAnonWorker(orthancClient: OrthancClient) {
  const anonWorker = new Worker(
    'anon',
    async (job: Job) => {
      console.log(`Processing job ${job.id}; Anon ${JSON.stringify(job.data.anonymize)}`);
      job.progress = 0;
      let anonAnswer = await orthancClient.anonymize(
        "studies",
        job.data.anonymize.orthancStudyID,
        job.data.anonymize.profile,
        job.data.anonymize.newAccessionNumber,
        job.data.anonymize.newPatientID,
        job.data.anonymize.newPatientName,
        job.data.anonymize.newStudyDescription
      );



    },
  );

  anonWorker.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed with error ${err.message}`);
  });

  anonWorker.on('progress', (job, progress) => {
  });
}

export default setupAnonWorker;
