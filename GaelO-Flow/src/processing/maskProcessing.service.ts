import { Injectable } from '@nestjs/common';
import { ProcessingMaskEnum } from './processingMask.enum';
import ProcessingClient from './ProcessingClient';
import OrthancClient from '../orthanc/OrthancClient';

@Injectable()
export class MaskProcessingService {
  private maskId: string;
  private petId: string;
  private petSeriesOrthancId: string;

  constructor(private readonly processingService: ProcessingClient) {}

  setMaskId(maskId: string): void {
    this.maskId = maskId;
  }

  getMaskId(): string {
    return this.maskId;
  }

  setPetId(petId: string, petSeriesOrthancId: string): void {
    this.petId = petId;
    this.petSeriesOrthancId = petSeriesOrthancId;
  }

  async getMaskAs(
    type: ProcessingMaskEnum,
    orientation: string = null,
  ): Promise<any> {
    switch (type) {
      case ProcessingMaskEnum.NIFTI:
        return await this.processingService.getMaskDicomOrientation(
          this.maskId,
          orientation,
          true,
        );
      case ProcessingMaskEnum.RTSS:
        const rtssId = await this.processingService.createRtssFromMask(
          this.petSeriesOrthancId,
          this.maskId,
        );
        const rtssStream = await this.processingService.getRtss(rtssId);
        await this.processingService.deleteRessource('rtss', rtssId);
        return rtssStream;
      case ProcessingMaskEnum.SEG:
        const segId = await this.processingService.createSegFromMask(
          this.petSeriesOrthancId,
          this.maskId,
        );
        const seg = await this.processingService.getSeg(segId);
        await this.processingService.deleteRessource('seg', segId);
        return seg;
      default:
        throw new Error('Invalid mask type');
    }
  }

  async getStatOfMask(): Promise<object> {
    return await this.processingService.getStatsMaskSeries(
      this.maskId,
      this.petId,
    );
  }

  async fragmentMask(): Promise<MaskProcessingService> {
    const fragmentedMaskId = await this.processingService.fragmentMask(
      this.petId,
      this.maskId,
      true,
    );
    const fragmentedMask = new MaskProcessingService(this.processingService);
    fragmentedMask.setMaskId(fragmentedMaskId);
    fragmentedMask.setPetId(this.petId, this.petSeriesOrthancId);
    return fragmentedMask;
  }

  async thresholdMaskTo41(): Promise<MaskProcessingService> {
    const thresholdedMaskId = await this.processingService.thresholdMask(
      this.maskId,
      this.petId,
      '41%',
    );
    const thresholdedMask = new MaskProcessingService(this.processingService);
    thresholdedMask.setMaskId(thresholdedMaskId);
    thresholdedMask.setPetId(this.petId, this.petSeriesOrthancId);
    return thresholdedMask;
  }
}
