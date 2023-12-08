import { Worker, Job } from 'bullmq';
import OrthancClient from '../../orthanc/OrthancClient';

async function setupDeleteWorker(orthancClient: OrthancClient) {
  const deleteWorker = new Worker(
    'delete',
    async (job: Job) => {
      job.updateProgress(0);
      await orthancClient.deleteFromOrthanc('series', job.data.orthancSeriesId);
      job.updateProgress(100);
    },
  );

  deleteWorker.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed with error ${err.message}`);
  });

  deleteWorker.on('progress', (job, progress) => {
  });
}

export default setupDeleteWorker;
