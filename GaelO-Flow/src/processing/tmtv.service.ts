import { Injectable } from '@nestjs/common';
import OrthancClient from '../orthanc/OrthancClient';
import ProcessingClient from './ProcessingClient';
import { ProcessingFile } from './ProcessingFile';
import { createWriteStream } from 'fs';

@Injectable()
export class TmtvService {
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

  async sendDicomToProcessing() {
    const ptDicom = await this.orthancClient.getArchiveDicomAsStream([
      this.ptOrthancSeriesId,
    ]);

    const writer = createWriteStream('ptDicom.zip');
    writer.write(ptDicom);
    writer.end();

    console.log('ptDicom: ', ptDicom);
    console.log('typeof ptDicom: ', typeof ptDicom);
    console.log('ptDicom instanceof Buffer', ptDicom instanceof Buffer);
    // const ptResponse = await this.processingClient.createDicom(ptDicom);
    // this.createdFiles.push(new ProcessingFile(ptResponse.data, 'dicoms'));

    // const ctDicom = await this.orthancClient.getArchiveDicomAsStream([
    //   this.ctOrthancSeriesId,
    // ]);
    // const ctResponse = await this.processingClient.createDicom(ctDicom);
    // this.createdFiles.push(new ProcessingFile(ctResponse.data, 'dicoms'));
  }
}
