import { Injectable } from '@nestjs/common';
import { MaskProcessingService } from './maskProcessing.service';
import OrthancClient from '../orthanc/OrthancClient';
import ProcessingClient from './ProcessingClient';
import { ProcessingFile } from './ProcessingFile';

@Injectable()
export class TmtvProcessingService {
  private ptOrthancSeriesId: string;
  private ctOrthancSeriesId: string;
  private createdFiles: ProcessingFile[] = [];

  constructor(
    private readonly orthancClient: OrthancClient,
    private readonly processingClient: ProcessingClient,
  ) {}

  setPtOrthancSeriesId(orthancSeriesId: string): void {
    this.ptOrthancSeriesId = orthancSeriesId;
  }

  setCtOrthancSeriesId(orthancSeriesId: string): void {
    this.ctOrthancSeriesId = orthancSeriesId;
  }

  createDicom(stream: Buffer) {
    return this.processingClient.createDicom(stream);
  }
}
