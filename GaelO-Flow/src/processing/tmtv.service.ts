import { Injectable } from '@nestjs/common';
import { MaskProcessingService } from './maskProcessing.service';
import OrthancClient from 'src/orthanc/OrthancClient';
import { Exception } from 'handlebars';
import { ProcessingClient } from './ProcessingClient';
import { ProcessingFile } from './ProcessingFile';
// import { GaelOException } from '../exceptions/gaelo.exception';
// import { DicomStudyRepositoryInterface } from '../interfaces/dicom-study-repository.interface';
// import { GaelOProcessingService } from './gaelo-processing.service';
// import { OrthancService } from './orthanc.service';
// import { GaelOProcessingFile } from '../jobs/radiomics-report/gaelo-processing-file';
// import { MaskProcessingService } from './mask-processing.service';

@Injectable()
export class TmtvProcessingService {
  private ptOrthancSeriesId: string;
  private ctOrthancSeriesId: string;
  private ptSeriesUid: string;
  private ctSeriesUid: string;
  private createdFiles: ProcessingFile[] = [];

  constructor(
    private readonly dicomStudyRepositoryInterface: DicomStudyRepositoryInterface,
    private readonly orthancClient: OrthancClient,
    private readonly gaelOProcessingClient: ProcessingClient,
  ) {
    // this.orthancClient.setOrthancServer(true);
  }

  public async runInference(): Promise<MaskProcessingService> {
    // await this.orthancClient.sendDicomToProcessing(
    //   this.ptOrthancSeriesId,
    //   this.gaelOProcessingClient,
    // );
    this.addCreatedResource('dicoms', this.ptOrthancSeriesId);
    // await this.orthancClient.sendDicomToProcessing(
    //   this.ctOrthancSeriesId,
    //   this.gaelOProcessingClient,
    // );
    this.addCreatedResource('dicoms', this.ptOrthancSeriesId);

    const idPT = await this.gaelOProcessingClient.createSeriesFromOrthanc(
      this.ptOrthancSeriesId,
      true,
      true,
    );
    this.addCreatedResource('series', idPT);
    const idCT = await this.gaelOProcessingClient.createSeriesFromOrthanc(
      this.ctOrthancSeriesId,
    );
    this.addCreatedResource('series', idCT);

    const inferencePayload = {
      idPT: idPT,
      idCT: idCT,
    };

    const inferenceResponse = await this.gaelOProcessingClient.executeInference(
      'pt_seg_attentionunet',
      inferencePayload,
    );
    const maskId = inferenceResponse['id_mask'];
    const maskProcessingService = new MaskProcessingService(
      this.orthancClient,
      this.gaelOProcessingClient,
    );
    maskProcessingService.setMaskId(maskId);
    maskProcessingService.setPetId(idPT, this.ptOrthancSeriesId);
    this.addCreatedResource('masks', maskId);
    return maskProcessingService;
  }

  public async loadPetAndCtSeriesOrthancIdsFromVisit(
    visitId: string,
  ): Promise<void> {
    const dicomStudyEntity =
      await this.dicomStudyRepositoryInterface.getDicomsDataFromVisit(
        visitId,
        false,
        false,
      );

    let idPT: string | null = null;
    let ptSeriesUid: string | null = null;
    let idCT: string | null = null;
    let ctSeriesUid: string | null = null;

    for (const series of dicomStudyEntity[0]['dicom_series']) {
      if (series['modality'] === 'PT') {
        if (idPT)
          throw new Exception(
            'Multiple PET Series, unable to perform segmentation',
          );
        idPT = series['orthanc_id'];
        ptSeriesUid = series['series_uid'];
      }
      if (series['modality'] === 'CT') {
        if (idCT)
          throw new Exception(
            'Multiple CT Series, unable to perform segmentation',
          );
        idCT = series['orthanc_id'];
        ctSeriesUid = series['series_uid'];
      }
    }

    if (!idPT || !idCT) {
      throw new Exception("Didn't find CT and PT Series to run the inference");
    }

    this.ctOrthancSeriesId = idCT;
    this.ptOrthancSeriesId = idPT;
    this.ptSeriesUid = ptSeriesUid!;
    this.ctSeriesUid = ctSeriesUid!;
  }

  public getInferredPtSeriesUid(): string {
    return this.ptSeriesUid;
  }

  public addCreatedResource(type: string, id: string): void {
    // this.createdFiles.push(new GaelOProcessingFile(type, id));
  }

  public async deleteCreatedResources(): Promise<void> {
    for (const gaeloProcessingFile of this.createdFiles) {
      try {
        await this.gaelOProcessingClient.deleteRessource(
          gaeloProcessingFile.getType(),
          gaeloProcessingFile.getId(),
        );
      } catch (error) {}
    }
  }
}
