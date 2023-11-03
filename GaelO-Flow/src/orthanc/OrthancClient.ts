import { ConfigService } from '@nestjs/config';
import { HttpClient } from './HttpClient';
import { Injectable } from '@nestjs/common';

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

  findInOrthanc(level = 'Study', patientName = '', patientID = '', accessionNb = '', date = '', studyDescription = '', modality = '', studyInstanceUID = '', seriesInstanceUID='', labels = []) {

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
            SeriesInstanceUID : seriesInstanceUID

        },
        Labels: labels
    }

    this.request('/tools/find', 'post', payload, this.username)
}

  findInOrthancByUid(studyUID) {
    return this.findInOrthanc(
      'Study',
      '',
      '',
      '',
      '',
      '',
      '',
      studyUID,
    );
  }

  findInOrthancBySeriesInstanceUID(seriesInstanceUID) {
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
  }

  getOrthancDetails(level, orthancID) {
    return this.request(
      '/' + level + '/' + orthancID,
      'get',
      undefined,
      undefined,
    );
  }

  getStudiesDetailsOfPatient(orthancID) {
    return this.request(
      '/patients/' + orthancID + '/studies?expand',
      'get',
      undefined,
      undefined,
    );
  }

  getSeriesDetailsOfStudy(orthancID) {
    return this.request(
      '/studies/' + orthancID + '/series?expand',
      'get',
      undefined,
      undefined,
    );
  }
}
