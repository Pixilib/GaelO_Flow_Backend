import fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { HttpClient } from './HttpClient';
import { Injectable } from '@nestjs/common';
import TagAnon, { TagPolicies } from './TagAnon';
import { AxiosResponse } from 'axios';
import QuerySeriesAnswer from './QueryAnswer/QuerySeriesAnswer';
import QueryStudyAnswer from './QueryAnswer/QueryStudyAnswer';

@Injectable()
export default class OrthancClient extends HttpClient {
  constructor(private readonly ConfigService: ConfigService) {
    super();
    this.loadCredentials();
  }

  loadCredentials = () => {
    const orthancAddress = this.ConfigService.get('ORTHANC_ADDRESS');
    const orthancPort = this.ConfigService.get('ORTHANC_PORT');
    const orthancUsername = this.ConfigService.get('ORTHANC_USERNAME');
    const orthancPassword = this.ConfigService.get('ORTHANC_PASSWORD');
    this.setAddress(orthancAddress);
    this.setPort(orthancPort);
    this.setUsername(orthancUsername);
    this.setPassword(orthancPassword);
  };

  getSystem = () => {
    return this.request('/system', 'get', undefined);
  };

  private getArchiveDicomPath = (filename) => {
    return process.cwd() + '/data/export_dicom/' + filename + '.zip';
  };

  getArchiveDicom = (
    orthancIds: string[],
    hierarchical: boolean = true,
    transcoding: string | null = null,
  ) => {
    let payload;

    if (transcoding) {
      payload = {
        Transcode: transcoding,
        Resources: orthancIds,
      };
    } else {
      payload = {
        Resources: orthancIds,
      };
    }

    const api = hierarchical
      ? '/tools/create-archive'
      : '/tools/create-media-extended';

    return new Promise((resolve, reject) => {
      try {
        const destination = this.getArchiveDicomPath(
          Math.random().toString(36).slice(2, 5),
        );
        const streamWriter = fs.createWriteStream(destination);
        this.streamToWriteAnswerWithCallBack(
          api,
          'POST',
          payload,
          streamWriter,
          () => {
            resolve(destination);
          },
        );
      } catch (err) {
        reject();
      }
    });
  };

  findInOrthanc = (
    level: string = 'Study',
    patientName: string = '',
    patientID: string = '',
    accessionNb: string = '',
    date: string = '',
    studyDescription: string = '',
    modality: string = '',
    studyInstanceUID: string = '',
    seriesInstanceUID: string = '',
    labels = [],
  ) => {
    const payload = {
      Level: level,
      CaseSensitive: false,
      Expand: true,
      Query: {
        StudyDate: date,
        StudyDescription: studyDescription,
        ModalitiesInStudy: modality,
        PatientName: patientName,
        PatientID: patientID,
        AccessionNumber: accessionNb,
        StudyInstanceUID: studyInstanceUID,
        SeriesInstanceUID: seriesInstanceUID,
      },
      Labels: labels,
    };

    return this.request('/tools/find', 'post', payload);
  };

  findInOrthancByUid = (studyUID: string) => {
    return this.findInOrthanc('Study', '', '', '', '', '', '', studyUID); // return void ?
  };

  findInOrthancBySeriesInstanceUID = (seriesInstanceUID: string) => {
    return this.findInOrthanc(
      'Series',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      seriesInstanceUID,
    );
  };

  getOrthancDetails = (level: string, orthancID: string) => {
    return this.request(
      '/' + level + '/' + orthancID,
      'get',
      undefined,
      undefined,
    );
  };

  getStudiesDetailsOfPatient = (orthancID: string) => {
    return this.request(
      '/patients/' + orthancID + '/studies?expand',
      'get',
      undefined,
      undefined,
    );
  };

  getSeriesDetailsOfStudy = (orthancID: string) => {
    return this.request(
      '/studies/' + orthancID + '/series?expand',
      'get',
      undefined,
      undefined,
    );
  };

  deleteFromOrthanc = async (level: string, orthancID: string) => {
    return this.request(
      '/' + level + '/' + orthancID,
      'delete',
      undefined,
      undefined,
    );
  };

  private buildAnonPayload = (
    profile: string,
    newAccessionNumber: string,
    newPatientID: string,
    newPatientName: string,
    newStudyDescription: string,
    synchronous: string,
  ): object => {
    const tagObjectArray = [];
    let date: TagPolicies;
    let body: TagPolicies;

    if (profile === 'Default') {
      date = TagPolicies.KEEP;
      body = TagPolicies.KEEP;

      tagObjectArray.push(
        new TagAnon('0010,0030', TagPolicies.REPLACE, '19000101'),
      ); // BirthDay
      tagObjectArray.push(
        new TagAnon('0008,1030', TagPolicies.REPLACE, newStudyDescription),
      ); // studyDescription
      tagObjectArray.push(new TagAnon('0008,103E', TagPolicies.KEEP)); // series Description
    } else if (profile === 'Full') {
      date = TagPolicies.REMOVE;
      body = TagPolicies.REMOVE;

      tagObjectArray.push(
        new TagAnon('0010,0030', TagPolicies.REPLACE, '19000101'),
      ); // BirthDay
      tagObjectArray.push(new TagAnon('0008,1030', TagPolicies.REMOVE)); // studyDescription
      tagObjectArray.push(new TagAnon('0008,103E', TagPolicies.REMOVE)); // series Description
    }

    // List tags releted to Date
    tagObjectArray.push(new TagAnon('0008,0022', date)); // Acquisition Date
    tagObjectArray.push(new TagAnon('0008,002A', date)); // Acquisition DateTime
    tagObjectArray.push(new TagAnon('0008,0032', date)); // Acquisition Time
    tagObjectArray.push(new TagAnon('0038,0020', date)); // Admitting Date
    tagObjectArray.push(new TagAnon('0038,0021', date)); // Admitting Time
    tagObjectArray.push(new TagAnon('0008,0035', date)); // Curve Time
    tagObjectArray.push(new TagAnon('0008,0025', date)); // Curve Date
    tagObjectArray.push(new TagAnon('0008,0023', date)); // Content Date
    tagObjectArray.push(new TagAnon('0008,0033', date)); // Content Time
    tagObjectArray.push(new TagAnon('0008,0024', date)); // Overlay Date
    tagObjectArray.push(new TagAnon('0008,0034', date)); // Overlay Time
    tagObjectArray.push(new TagAnon('0040,0244', date)); // ...Start Date
    tagObjectArray.push(new TagAnon('0040,0245', date)); // ...Start Time
    tagObjectArray.push(new TagAnon('0008,0021', date)); // Series Date
    tagObjectArray.push(new TagAnon('0008,0031', date)); // Series Time
    tagObjectArray.push(new TagAnon('0008,0020', date)); // Study Date
    tagObjectArray.push(new TagAnon('0008,0030', date)); // Study Time
    tagObjectArray.push(new TagAnon('0010,21D0', date)); // Last menstrual date
    tagObjectArray.push(new TagAnon('0008,0201', date)); // Timezone offset from UTC
    tagObjectArray.push(new TagAnon('0040,0002', date)); // Scheduled procedure step start date
    tagObjectArray.push(new TagAnon('0040,0003', date)); // Scheduled procedure step start time
    tagObjectArray.push(new TagAnon('0040,0004', date)); // Scheduled procedure step end date
    tagObjectArray.push(new TagAnon('0040,0005', date)); // Scheduled procedure step end time

    // same for Body characteristics
    tagObjectArray.push(new TagAnon('0010,2160', body)); // Patient's ethnic group
    tagObjectArray.push(new TagAnon('0010,21A0', body)); // Patient's smoking status
    tagObjectArray.push(new TagAnon('0010,0040', body)); // Patient's sex
    tagObjectArray.push(new TagAnon('0010,2203', body)); // Patient's sex neutered
    tagObjectArray.push(new TagAnon('0010,1010', body)); // Patient's age
    tagObjectArray.push(new TagAnon('0010,21C0', body)); // Patient's pregnancy status
    tagObjectArray.push(new TagAnon('0010,1020', body)); // Patient's size
    tagObjectArray.push(new TagAnon('0010,1030', body)); // Patient's weight

    // Others
    tagObjectArray.push(
      new TagAnon('0008,0050', TagPolicies.REPLACE, newAccessionNumber),
    ); // Accession Number
    tagObjectArray.push(
      new TagAnon('0010,0020', TagPolicies.REPLACE, newPatientID),
    ); // new Patient Name
    tagObjectArray.push(
      new TagAnon('0010,0010', TagPolicies.REPLACE, newPatientName),
    ); // new Patient Name

    // Keep some Private tags usefull for PET/CT or Scintigraphy
    tagObjectArray.push(new TagAnon('7053,1000', TagPolicies.KEEP)); // Phillips
    tagObjectArray.push(new TagAnon('7053,1009', TagPolicies.KEEP)); // Phillips
    tagObjectArray.push(new TagAnon('0009,103B', TagPolicies.KEEP)); // GE
    tagObjectArray.push(new TagAnon('0009,100D', TagPolicies.KEEP)); // GE
    tagObjectArray.push(new TagAnon('0011,1012', TagPolicies.KEEP)); // Other

    const anonParameters = {
      KeepPrivateTags: false,
      Force: true,
      Synchronous: synchronous,
      DicomVersion: '2021b',
      Keep: [],
      Replace: {},
    };

    tagObjectArray.forEach((tag) => {
      const tagNb = tag.tagNumber;
      const tagNewValue = tag.newValue;
      if (tag.choice === TagPolicies.KEEP) {
        anonParameters.Keep.push(tagNb);
      } else if (tag.choice === TagPolicies.REPLACE) {
        anonParameters.Replace[tagNb] = tagNewValue;
      }
    });

    return anonParameters;
  };

  anonymize = async (
    level: string,
    orthancID: string,
    profile: string,
    newAccessionNumber: string,
    newPatientID: string,
    newPatientName: string,
    newStudyDescription: string,
    synchronous: string,
  ) => {
    let payload = this.buildAnonPayload(
      profile,
      newAccessionNumber,
      newPatientID,
      newPatientName,
      newStudyDescription,
      synchronous,
    );
    const answer = this.request(
      '/' + level + '/' + orthancID + '/anonymize',
      'post',
      payload,
    );
    return answer;
  };

  getChangesSince = (since: string) => {
    let outPutStream = '/changes?since=' + since;
    return this.request(outPutStream, 'get', undefined, undefined);
  };

  getLastChanges = () => {
    let outPutStream = '/changes?last';
    return this.request(outPutStream, 'get', undefined, undefined);
  };

  getSopClassUID = (instanceID: string) => {
    return this.request(
      '/instances/' + instanceID + '/metadata/SopClassUid',
      'get',
      undefined,
      undefined,
    );
  };

  monitorJob = (
    jobPath: string,
    updateCallback: (response: AxiosResponse) => void,
    updateInterval: number,
  ) => {
    return new Promise((resolve, reject) => {
      let interval = setInterval(() => {
        this.request(jobPath, 'get', undefined, undefined)
          .then((response) => {
            updateCallback(response);
            if (response.statusText === 'Success') {
              // is response.State the same as response.statusText ?
              clearInterval(interval);
              resolve(response);
            } else if (response.statusText === 'Failure') {
              // same here
              clearInterval(interval);
              reject(response);
            }
          })
          .catch(reject);
      }, updateInterval);
    });
  };

  makeRetrieve = (queryID, answerNumber, aet, synchronous = false) => {
    const postData = {
      Synchronous: synchronous,
      TargetAet: aet,
    };

    return this.request(
      '/queries/' + queryID + '/answers/' + answerNumber + '/retrieve',
      'post',
      postData,
    );
  };

  sendToAET = (aet: string, orthancIds: Array<string>) => {
    const payload = {
      Asynchronous: true,
      Ressources: orthancIds,
    };
    return this.request('/modalities/' + aet + '/store', 'POST', payload);
  };

  queryStudiesInAet = async (
    patientName: string = '',
    patientID: string = '',
    studyDate: string = '',
    modality: string = '',
    studyDescription: string = '',
    accessionNb: string = '',
    studyInstanceUID: string = '',
    aet: string = '',
  ): Promise<QueryStudyAnswer[]> => {
    if (patientName === '*^*') patientName = '';
    // Remove * character as until date X should be written -dateX and not *-dateX
    studyDate = studyDate.replace(/[*]/g, '');

    if (studyDate === '-') studyDate = '';

    const payload = {
      Level: 'Study',
      Query: {
        PatientName: patientName,
        PatientID: patientID,
        StudyDate: studyDate,
        ModalitiesInStudy: modality,
        StudyDescription: studyDescription,
        AccessionNumber: accessionNb,
        StudyInstanceUID: studyInstanceUID,
        NumberOfStudyRelatedInstances: '',
        NumberOfStudyRelatedSeries: '',
        RequestedProcedureDescription: '',
      },
    };

    const answer = await this.request(
      '/modalities/' + aet + '/query',
      'post',
      payload,
    ).catch((err: any) => {
      throw err;
    });

    return this.getStudyAnswerDetails(answer.data.ID, aet);
  };

  querySeriesInAet = async (
    studyUID: string = '',
    modality: string = '',
    protocolName: string = '',
    seriesDescription: string = '',
    seriesNumber: string = '',
    seriesInstanceUID: string = '',
    aet: string = '',
  ): Promise<QuerySeriesAnswer[]> => {
    const payload = {
      Level: 'Series',
      Query: {
        Modality: modality,
        ProtocolName: protocolName,
        SeriesDescription: seriesDescription,
        SeriesInstanceUID: seriesInstanceUID,
        StudyInstanceUID: studyUID,
        SeriesNumber: seriesNumber,
        NumberOfSeriesRelatedInstances: '',
      },
    };

    const answer = await this.request(
      '/modalities/' + aet + '/query',
      'post',
      payload,
    ).catch((err: any) => {
      throw err;
    });

    return this.getSeriesAnswerDetails(answer.data.ID, aet);
  };

  private getStudyAnswerDetails = async (answerId: string, aet: string) => {
    const studyAnswers = await this.request(
      '/queries/' + answerId + '/answers?expand',
      'get',
      null,
    );
    const answersObjects: QueryStudyAnswer[] = [];

    for (let i = 0; i < studyAnswers.data.length; i++) {
      const element = studyAnswers[i];
      const queryLevel = element['0008,0052'].Value;

      let accessionNb = null;
      if (element.hasOwnProperty('0008,0050')) {
        accessionNb = element['0008,0050'].Value;
      }

      let studyDate = null;
      if (element.hasOwnProperty('0008,0020')) {
        studyDate = element['0008,0020'].Value;
      }

      let studyDescription = null;
      if (element.hasOwnProperty('0008,1030')) {
        studyDescription = element['0008,1030'].Value;
      }

      let patientName = null;
      if (element.hasOwnProperty('0010,0010')) {
        patientName = element['0010,0010'].Value;
      }

      let patientID = null;
      if (element.hasOwnProperty('0010,0020')) {
        patientID = element['0010,0020'].Value;
      }

      let studyUID = null;
      if (element.hasOwnProperty('0020,000d')) {
        studyUID = element['0020,000d'].Value;
      }

      let numberOfStudyRelatedSeries = null;
      if (element.hasOwnProperty('0020,1206')) {
        numberOfStudyRelatedSeries = element['0020,1206'].Value;
      }

      let numberOfStudyRelatedInstances = null;
      if (element.hasOwnProperty('0020,1208')) {
        numberOfStudyRelatedInstances = element['0020,1208'].Value;
      }

      let modalitiesInStudy = null;
      // Modalities in studies not always present
      if (element.hasOwnProperty('0008,0061')) {
        modalitiesInStudy = element['0008,0061'].Value;
      }

      let requestedProcedureDescription = null;
      if (element.hasOwnProperty('0032,1060')) {
        requestedProcedureDescription = element['0032,1060'].Value;
      }

      const originAET = aet;
      const queryAnswserObject = new QueryStudyAnswer(
        answerId,
        i,
        originAET,
        patientName,
        patientID,
        studyUID,
        accessionNb,
        studyDescription,
        studyDate,
        requestedProcedureDescription,
        modalitiesInStudy,
        numberOfStudyRelatedSeries,
        numberOfStudyRelatedInstances,
      );
      answersObjects.push(queryAnswserObject);
    }

    return answersObjects;
  };

  private getSeriesAnswerDetails = async (
    answerId: string,
    aet: string,
  ): Promise<QuerySeriesAnswer[]> => {
    const studyAnswers = await this.request(
      '/queries/' + answerId + '/answers?expand',
      'get',
      null,
    );

    const answersObjects: QuerySeriesAnswer[] = [];

    for (let i = 0; i < studyAnswers.data.length; i++) {
      const element = studyAnswers.data[i];
      const queryLevel = element['0008,0052'].Value;

      let accessionNb = null;
      if (element.hasOwnProperty('0008,0050')) {
        accessionNb = element['0008,0050'].Value;
      }

      let studyDate = null;
      if (element.hasOwnProperty('0008,0020')) {
        studyDate = element['0008,0020'].Value;
      }

      let studyDescription = null;
      if (element.hasOwnProperty('0008,1030')) {
        studyDescription = element['0008,1030'].Value;
      }

      let patientName = null;
      if (element.hasOwnProperty('0010,0010')) {
        patientName = element['0010,0010'].Value;
      }

      let patientID = null;
      if (element.hasOwnProperty('0010,0020')) {
        patientID = element['0010,0020'].Value;
      }

      let requestedProcedureDescription = null;
      if (element.hasOwnProperty('0032,1060')) {
        requestedProcedureDescription = element['0032,1060'].Value;
      }

      let Modality = null;
      if (element.hasOwnProperty('0008,0060')) {
        Modality = element['0008,0060'].Value;
      }

      let SeriesDescription = null;
      if (element.hasOwnProperty('0008,103e')) {
        SeriesDescription = element['0008,103e'].Value;
      }

      let StudyInstanceUID = null;
      if (element.hasOwnProperty('0020,000d')) {
        StudyInstanceUID = element['0020,000d'].Value;
      }

      let SeriesInstanceUID = null;
      if (element.hasOwnProperty('0020,000e')) {
        SeriesInstanceUID = element['0020,000e'].Value;
      }

      let SeriesNumber = null;
      if (element.hasOwnProperty('0020,0011')) {
        SeriesNumber = element['0020,0011'].Value;
      }

      let numberOfSeriesRelatedInstances = null;
      if (element.hasOwnProperty('0020,1209')) {
        numberOfSeriesRelatedInstances = element['0020,1209'].Value;
      }

      const originAET = aet;
      const queryAnswserObject = new QuerySeriesAnswer(
        answerId,
        i,
        originAET,
        patientName,
        patientID,
        StudyInstanceUID,
        SeriesInstanceUID,
        accessionNb,
        studyDescription,
        studyDate,
        requestedProcedureDescription,
        Modality,
        SeriesDescription,
        SeriesNumber,
        numberOfSeriesRelatedInstances,
      );
      answersObjects.push(queryAnswserObject);
    }

    return answersObjects;
  };
}
