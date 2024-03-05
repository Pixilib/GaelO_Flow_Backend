import { Injectable } from '@nestjs/common';
import { ProcessingMaskEnum } from './processingMask.enum';
import ProcessingClient from './ProcessingClient';
import OrthancClient from '../orthanc/OrthancClient';
// TODO: Import OrthancClient

@Injectable()
export class MaskProcessingService {
  private maskId: string;
  private petId: string;
  private petSeriesOrthancId: string;

  constructor(
    private readonly orthancClient: OrthancClient,
    private readonly gaeloProcessingService: ProcessingClient,
  ) {
    // TODO: Set Orthanc Server
  }

  public setMaskId(maskId: string): void {
    this.maskId = maskId;
  }

  public getMaskId(): string {
    return this.maskId;
  }

  public setPetId(petId: string, petSeriesOrthancId: string): void {
    this.petId = petId;
    this.petSeriesOrthancId = petSeriesOrthancId;
  }

  public async getMaskAs(
    type: ProcessingMaskEnum,
    orientation: string | null,
  ): Promise<string> {
    let exportFile: string;

    switch (type) {
      case ProcessingMaskEnum.NIFTI:
        exportFile = await this.gaeloProcessingService.getMaskDicomOrientation(
          this.maskId,
          orientation,
          true,
        );
        break;
      case ProcessingMaskEnum.RTSS:
        const rtssId = await this.gaeloProcessingService.createRtssFromMask(
          this.petSeriesOrthancId,
          this.maskId,
        );
        exportFile = await this.gaeloProcessingService.getRtss(rtssId);
        await this.gaeloProcessingService.deleteRessource('rtss', rtssId);
        break;
      case ProcessingMaskEnum.SEG:
        const segId = await this.gaeloProcessingService.createSegFromMask(
          this.petSeriesOrthancId,
          this.maskId,
        );
        exportFile = await this.gaeloProcessingService.getSeg(segId);
        await this.gaeloProcessingService.deleteRessource('seg', segId);
        break;
      default:
        throw new Error('Unsupported mask type');
    }

    return exportFile;
  }

  public async getStatsOfMask(): Promise<any> {
    return await this.gaeloProcessingService.getStatsMaskSeries(
      this.maskId,
      this.petId,
    );
  }

  public async fragmentMask(): Promise<MaskProcessingService> {
    const fragmentedMaskId = await this.gaeloProcessingService.fragmentMask(
      this.petId,
      this.maskId,
      true,
    );
    const maskProcessingService = new MaskProcessingService(
      this.orthancClient,
      this.gaeloProcessingService,
    );
    maskProcessingService.setMaskId(fragmentedMaskId);
    maskProcessingService.setPetId(this.petId, this.petSeriesOrthancId);
    return maskProcessingService;
  }

  public async thresholdMaskTo41(): Promise<MaskProcessingService> {
    const threshold41MaskId = await this.gaeloProcessingService.thresholdMask(
      this.maskId,
      this.petId,
      '41%',
    );
    const maskProcessingService = new MaskProcessingService(
      this.orthancClient,
      this.gaeloProcessingService,
    );
    maskProcessingService.setMaskId(threshold41MaskId);
    maskProcessingService.setPetId(this.petId, this.petSeriesOrthancId);
    return maskProcessingService;
  }

  public async createTepMaskMip(): Promise<string> {
    const mipFragmentedPayload = {
      maskId: this.maskId,
      delay: 0.3,
      min: 0,
      max: 5,
      inverted: true,
      orientation: 'LPI',
    };
    return await this.gaeloProcessingService.createMIPForSeries(
      this.petId,
      mipFragmentedPayload,
    );
  }
}
