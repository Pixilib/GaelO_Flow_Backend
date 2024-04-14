import { QueryAnswerType } from '../../constants/enums';
import QueryAnswer from './query.answer';

export default class QueryStudyAnswer extends QueryAnswer {
  StudyInstanceUID: string;
  ModalitiesInStudy: string | null = null;
  NumberOfStudyRelatedSeries: number | null = null;
  NumberOfStudyRelatedInstances: number | null = null;

  constructor(
    answerId: string,
    answerNumber: number,
    originAET: string,
    patientName: string | null,
    patientID: string,
    studyInstanceUID: string,
    accessionNumber: string | null = null,
    studyDescription: string | null = null,
    studyDate: string | null = null,
    requestedProcedureDescription: string | null = null,
    modalitiesInStudy: string | null = null,
    numberOfStudyRelatedSeries: number | null = null,
    numberOfStudyRelatedInstances: number | null = null,
  ) {
    super(
      QueryAnswerType.LEVEL_STUDY,
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
    this.ModalitiesInStudy = modalitiesInStudy;
    this.StudyInstanceUID = studyInstanceUID;
    this.NumberOfStudyRelatedSeries = numberOfStudyRelatedSeries;
    this.NumberOfStudyRelatedInstances = numberOfStudyRelatedInstances;
  }

  setModalitiesInStudy = (modalitiesInStudy: string | null): void => {
    this.ModalitiesInStudy = modalitiesInStudy;
  };

  setStudyInstanceUID = (studyInstanceUID: string): void => {
    this.StudyInstanceUID = studyInstanceUID;
  };

  setNumberOfStudyRelatedSeries = (
    numberOfStudyRelatedSeries: number | null,
  ): void => {
    this.NumberOfStudyRelatedSeries = numberOfStudyRelatedSeries;
  };

  setNumberOfStudyRelatedInstances = (
    numberOfStudyRelatedInstances: number | null,
  ): void => {
    this.NumberOfStudyRelatedInstances = numberOfStudyRelatedInstances;
  };
}
