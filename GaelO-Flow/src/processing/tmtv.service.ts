import { Injectable } from '@nestjs/common';
import OrthancClient from '../orthanc/OrthancClient';
import ProcessingClient from './ProcessingClient';
import { ProcessingFile } from './ProcessingFile';
import { MaskProcessingService } from './maskProcessing.service';
import { ProcessingMaskEnum } from './processingMask.enum';

@Injectable()
export class TmtvService {
  private ptOrthancSeriesId: string;
  private ctOrthancSeriesId: string;

  private ptSeriesId: string;
  private ctSeriesId: string;

  private mask: MaskProcessingService;
  private fragmentedMask: MaskProcessingService;

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

  getCreatedFiles(): ProcessingFile[] {
    return this.createdFiles;
  }

  async sendDicomToProcessing() {
    await this.orthancClient
      .getArchiveDicomAsBuffer([this.ptOrthancSeriesId])
      .then(async (result) => {
        const ptResponse = await this.processingClient.createDicom(result);
        this.createdFiles.push(new ProcessingFile(ptResponse, 'dicoms'));
      });

    await this.orthancClient
      .getArchiveDicomAsBuffer([this.ctOrthancSeriesId])
      .then(async (result) => {
        const ctResponse = await this.processingClient.createDicom(result);
        this.createdFiles.push(new ProcessingFile(ctResponse, 'dicoms'));
      });
  }

  async createSeries() {
    await this.processingClient
      .createSeriesFromOrthanc(this.ctOrthancSeriesId, false, false)
      .then((ctSeriesId) => {
        this.ctSeriesId = ctSeriesId;

        this.createdFiles.push(new ProcessingFile(this.ctSeriesId, 'series'));
      });

    await this.processingClient
      .createSeriesFromOrthanc(this.ptOrthancSeriesId, true, true)
      .then((ptSeriesId) => {
        this.ptSeriesId = ptSeriesId;
        this.createdFiles.push(new ProcessingFile(this.ptSeriesId, 'series'));
      });
  }

  async runInference(fragmented: boolean = false) {
    const maskId = (
      await this.processingClient.executeInference('pt_seg_attentionunet', {
        idCT: this.ctSeriesId,
        idPT: this.ptSeriesId,
      })
    )['id_mask'];
    const mask = new MaskProcessingService(this.processingClient);

    mask.setMaskId(maskId);
    mask.setPetId(this.ptSeriesId, this.ptOrthancSeriesId);
    this.mask = mask;
    this.createdFiles.push(new ProcessingFile(maskId, 'masks'));

    if (fragmented) {
      console.log('this.ptSeriesId: ', this.ptSeriesId);
      console.log('maskId: ', maskId);

      const fragmentedMaskId = await this.processingClient.fragmentMask(
        this.ptSeriesId,
        maskId,
        true,
      );

      console.log(fragmentedMaskId, 'fragmentedMaskId');
      // this.createdFiles.push(new ProcessingFile(fragmentedMaskId, 'masks'));
      // const fragmentedMask = new MaskProcessingService(this.processingClient);
      // fragmentedMask.setMaskId(fragmentedMaskId);
      // fragmentedMask.setPetId(this.ptSeriesId, this.ptOrthancSeriesId);
      // this.fragmentedMask = fragmentedMask;
    }
  }

  async sendMaskAsRtssToOrthanc() {
    const rtssStream = await this.fragmentedMask.getMaskAs(
      ProcessingMaskEnum.RTSS,
    );
    // this.createdFiles.push(new ProcessingFile(rtssID, 'rtss'));
    // console.log(rtssStream, 'rtssID');

    // const rtssStream = await this.processingClient.getRtss(rtssID);
    // console.log(rtssStream, 'rtssStream');
    // this.orthancClient.sendToOrthanc(rtssStream);
  }

  async sendMaskAsSegToOrthanc() {
    const segId = await this.fragmentedMask.getMaskAs(ProcessingMaskEnum.SEG);
    this.createdFiles.push(new ProcessingFile(segId, 'seg'));
    console.log(segId, 'segId');

    const segStream = this.processingClient.getSeg(segId);
    this.orthancClient.sendToOrthanc(segStream);
  }

  async deleteAllRessources() {
    this.createdFiles.forEach((file) => {
      this.processingClient.deleteRessource(file.getType(), file.getId());
    });
  }
}
