import { QueryAnswerType } from '../../constants/enums';
import QueryAnswer from './query.answer';

export default class QuerySeriesAnswer extends QueryAnswer {
  StudyInstanceUID: string;
  SeriesInstanceUID: string;
  Modality: string | null = null;
  SeriesDescription: string | null = null;
  SeriesNumber: number | null = null;
  NumberOfSeriesRelatedInstances: number | null = null;

  constructor(
    answerId: string,
    answerNumber: number,
    originAET: string,
    patientName: string,
    patientID: string,

    studyUID: string,
    seriesUID: string,

    accessionNumber: string | null = null,
    studyDescription: string | null = null,
    studyDate: string | null = null,
    requestedProcedureDescription: string | null = null,

    modality: string | null = null,
    seriesDescription: string | null = null,
    seriesNumber: number | null = null,
    numberOfSeriesRelatedInstances: number | null = null,
  ) {
    super(
      QueryAnswerType.LEVEL_SERIES,
      answerId,
      answerNumber,
      originAET,
      patientName,
      patientID,
      accessionNumber,
      studyDescription,
      studyDate,
      requestedProcedureDescription,
    );
    this.StudyInstanceUID = studyUID;
    this.SeriesInstanceUID = seriesUID;
    this.Modality = modality;
    this.SeriesDescription = seriesDescription;
    this.SeriesNumber = seriesNumber;
    this.NumberOfSeriesRelatedInstances = numberOfSeriesRelatedInstances;
  }

  setStudyInstanceUID = (studyInstanceUID: string): void => {
    this.StudyInstanceUID = studyInstanceUID;
  };

  setSeriesInstanceUID = (seriesInstanceUID: string): void => {
    this.SeriesInstanceUID = seriesInstanceUID;
  };

  setModality = (modality: string | null): void => {
    this.Modality = modality;
  };

  setSeriesDescription = (seriesDescription: string | null): void => {
    this.SeriesDescription = seriesDescription;
  };

  setSeriesNumber = (seriesNumber: number | null): void => {
    this.SeriesNumber = seriesNumber;
  };

  setNumberOfSeriesRelatedInstances = (
    numberOfSeriesRelatedInstances: number | null,
  ): void => {
    this.NumberOfSeriesRelatedInstances = numberOfSeriesRelatedInstances;
  };
}
