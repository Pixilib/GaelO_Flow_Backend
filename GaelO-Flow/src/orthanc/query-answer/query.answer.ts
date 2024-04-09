import { QueryAnswerType } from '../../constants/enums';

export default abstract class QueryAnswer {
  AnswerId: string;
  AnswerNumber: number;
  OriginAET: string;
  PatientName: string;
  PatientID: string;
  AccessionNumber: string | null;
  StudyDescription: string | null;
  StudyDate: string | null;
  RequestedProcedureDescription: string | null;

  Level: QueryAnswerType;

  constructor(
    level: QueryAnswerType,
    answerId: string,
    answerNumber: number,
    originAET: string,
    patientName: string,
    patientID: string,
    accessionNumber: string | null,
    studyDescription: string | null,
    studyDate: string | null,
    requestedProcedureDescription: string | null,
  ) {
    this.AnswerId = answerId;
    this.AnswerNumber = answerNumber;
    this.Level = level;
    this.OriginAET = originAET;
    this.PatientName = patientName;
    this.PatientID = patientID;
    this.AccessionNumber = accessionNumber;
    this.StudyDescription = studyDescription;
    this.StudyDate = studyDate;
    this.RequestedProcedureDescription = requestedProcedureDescription;
  }

  setAnswerId = (answerId: string | null): void => {
    this.AnswerId = answerId;
  };

  setAnswerNumber = (answerNumber: number): void => {
    this.AnswerNumber = answerNumber;
  };

  setLevel = (level: QueryAnswerType): void => {
    this.Level = level;
  };

  setOriginAET = (originAET: string): void => {
    this.OriginAET = originAET;
  };

  setPatientName = (patientName: string): void => {
    this.PatientName = patientName;
  };

  setPatientID = (patientID: string): void => {
    this.PatientID = patientID;
  };

  setAccessionNumber = (accessionNumber: string | null): void => {
    this.AccessionNumber = accessionNumber;
  };

  setStudyDescription = (studyDescription: string | null): void => {
    this.StudyDescription = studyDescription;
  };

  setStudyDate = (studyDate: string | null): void => {
    this.StudyDate = studyDate;
  };

  setRequestedProcedureDescription = (
    requestedProcedureDescription: string | null,
  ): void => {
    this.RequestedProcedureDescription = requestedProcedureDescription;
  };
}
