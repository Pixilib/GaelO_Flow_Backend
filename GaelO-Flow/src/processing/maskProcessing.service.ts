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
    private readonly processingService: ProcessingClient,
  ) {
    // TODO: Set Orthanc Server
  }
}
