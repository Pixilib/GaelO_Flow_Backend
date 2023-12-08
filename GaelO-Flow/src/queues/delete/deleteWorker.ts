import { Worker, Job } from 'bullmq';
import OrthancClient from '../../orthanc/OrthancClient';

async function setupDeleteWorker(orthancClient: OrthancClient) {
  const deleteWorker = new Worker(
    'delete',
    async (job: Job) => {
      console.log(`Processing job ${job.id}; Delete ${job.data.orthancSeriesId}`);
      job.progress = 0;
      await orthancClient.deleteFromOrthanc('series', job.data.orthancSeriesId);
      job.progress = 100;
    },
  );

  deleteWorker.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed with error ${err.message}`);
  });

  deleteWorker.on('progress', (job, progress) => {
  });
}

export default setupDeleteWorker;
