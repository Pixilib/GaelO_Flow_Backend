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

  public setPetSeriesOrthancId = (seriesOrthancId) => {
    this.ptOrthancSeriesId = seriesOrthancId;
  };

  public setCtSeriesOrthancId = (seriesOrthancId) => {
    this.ctOrthancSeriesId = seriesOrthancId;
  };

  public async runInference(): Promise<MaskProcessingService> {
    const petArchive = await this.orthancClient.getArchiveDicomAsStream(
      [this.ptOrthancSeriesId],
      true,
    );
    this.processingClient.createDicom(petArchive);

    const ctArchive = await this.orthancClient.getArchiveDicomAsStream(
      [this.ctOrthancSeriesId],
      true,
    );

    this.processingClient.createDicom(ctArchive);
    this.addCreatedResource('dicoms', this.ptOrthancSeriesId);
    this.addCreatedResource('dicoms', this.ctOrthancSeriesId);

    const idPT = await this.processingClient.createSeriesFromOrthanc(
      this.ptOrthancSeriesId,
      true,
      true,
    );

    this.addCreatedResource('series', idPT);

    const idCT = await this.processingClient.createSeriesFromOrthanc(
      this.ctOrthancSeriesId,
    );

    this.addCreatedResource('series', idCT);

    const inferencePayload = {
      idPT: idPT,
      idCT: idCT,
    };

    const inferenceResponse = await this.processingClient.executeInference(
      'pt_seg_attentionunet',
      inferencePayload,
    );

    const maskId = inferenceResponse['id_mask'];
    const maskProcessingService = new MaskProcessingService(
      this.orthancClient,
      this.processingClient,
    );

    maskProcessingService.setMaskId(maskId);
    maskProcessingService.setPetId(idPT, this.ptOrthancSeriesId);
    this.addCreatedResource('masks', maskId);
    return maskProcessingService;
  }

  public addCreatedResource(type: string, id: string): void {
    this.createdFiles.push(new ProcessingFile(type, id));
  }

  public async deleteCreatedResources(): Promise<void> {
    for (const gaeloProcessingFile of this.createdFiles) {
      try {
        await this.processingClient.deleteRessource(
          gaeloProcessingFile.getType(),
          gaeloProcessingFile.getId(),
        );
      } catch (error) {}
    }
  }
}
