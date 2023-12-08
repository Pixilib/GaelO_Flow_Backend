import { Worker, Job } from 'bullmq';
import OrthancClient from '../../orthanc/OrthancClient';

async function processStudy(orthancClient: OrthancClient, job: Job) {
  job.updateProgress(0);
  const queryDetails = await orthancClient.queryStudiesInAet(job.data);
  // TODO: check that array length is 1
  const studyDetails = queryDetails[0];

  job.updateProgress(10);
  const request = await orthancClient.makeRetrieve(studyDetails.AnswerId, studyDetails.AnswerNumber, studyDetails.OriginAET, true);
  const orthancResults = await orthancClient.findInOrthancByStudyInstanceUID(request.data["0020,000d"]);
  //Une fois fini stocker l'ID de la ressource orthanc recupérer dans les resultats du job
  orthancResults[0].ID
  job.updateProgress(100);
};

function processSeries(orthancClient: OrthancClient, job: Job) {
  job.updateProgress(0);
  const seriesDetails = orthancClient.querySeriesInAet(job.data);
  job.updateProgress(10);
};

async function setupQueryWorker(orthancClient: OrthancClient) {
  const queryWorker = new Worker(
    'query',
    async (job: Job) => {
      if (job.data.series)
        processSeries(orthancClient, job);
      if (job.data.study)
        processStudy(orthancClient, job);
    },
  );

  queryWorker.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed with error ${err.message}`);
  });

  queryWorker.on('progress', (job, progress) => {
  });
}

export default setupQueryWorker;
