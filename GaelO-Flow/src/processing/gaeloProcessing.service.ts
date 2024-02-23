import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import OrthancClient from 'src/orthanc/OrthancClient';
import { tmpName, tmpNameSync } from 'tmp';
import { ProcessingRequest } from './processingRequest';

@Injectable()
export class GaeloProcessingService {
  processingRequest: ProcessingRequest;

  constructor(
    private readonly orthancClient: OrthancClient,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.processingRequest = new ProcessingRequest(
      orthancClient,
      configService,
      httpService,
    );
  }

  async createSeriesFromOrthanc(
    orthancSeriesId: string,
    pet: boolean = false,
    convertToSuv: boolean = false,
  ): Promise<any> {
    const response = await this.processingRequest.post(
      `/tools/create-series-from-orthanc`,
      {
        orthancSeriesId,
        pet,
        convertToSuv,
      },
    );
    console.log(response);
    return response;
  }

  async createDicom(filename: string) {
    const response = await this.processingRequest.uploadFile(
      '/dicoms',
      filename,
    );
    console.log(response);
    return response;
  }

  async executeInference(modelName: string, payload: any): Promise<any> {
    const response = await this.processingRequest.post(
      `/models/${modelName}/inference`,
      payload,
    );
    console.log(response);
    return response;
  }

  async createMIPForSeries(
    seriesId: string,
    payload: any = { orientation: 'LPI' },
  ) {
    const downloadPath = tmpNameSync({ dir: './' });
    const response = await this.processingRequest.requestStreamResponseToFile(
      'POST',
      `/series/${seriesId}/mip`,
      downloadPath,
      { 'Content-Type': 'application/json' },
      payload,
    );
    console.log(response);
    return downloadPath;
  }

  async createMosaicForSeries(
    seriesId: string,
    payload: any = {
      min: null,
      max: null,
      cols: 5,
      nbImages: 20,
      width: 512,
      height: 512,
      orientation: 'LPI',
    },
  ) {
    const downloadPath = tmpNameSync({ dir: './' });
    const response = await this.processingRequest.requestStreamResponseToFile(
      'POST',
      `/series/${seriesId}/mosaic`,
      downloadPath,
      { 'Content-Type': 'application/json' },
      payload,
    );
    console.log(response);
    return downloadPath;
  }

  async getNiftiMask(maskId: string): Promise<string> {
    return '<path>';
  }

  async getNiftiSeries(imageId: string): Promise<string> {
    return '<path>';
  }

  async createRtssFromMask(orthancSeriesId: string, maskId: string) {
    const response = await this.processingRequest.post('/tools/mask-to-rtss', {
      orthancSeriesId,
      maskId,
    });
    console.log(response);
    return response;
  }

  async getRtss(rtss: string) {
    return '<path>';
  }

  async createSegFromMask(orthancSeriesId: string, maskId: string) {
    const response = await this.processingRequest.post('/tools/mask-to-seg', {
      orthancSeriesId,
      maskId,
    });
    console.log(response);
    return response;
  }

  async getSeg(seg: string) {
    const downloadPath = tmpNameSync({ dir: './' });
    await this.processingRequest.requestStreamResponseToFile(
      'GET',
      `/seg/${seg}/file`,
      downloadPath,
      {},
    );
    return downloadPath;
  }

  async thresholdMask(
    maskId: string,
    seriesId: string,
    threshold: string | number,
  ) {
    const response = await this.processingRequest.post(
      '/tools/threshold-mask',
      {
        maskId,
        seriesId,
        threshold,
      },
    );
    console.log(response);
    return response;
  }

  async fragmentMask(seriesId: string, maskId: string, output3D: boolean) {
    const response = await this.processingRequest.post('/tools/fragment-mask', {
      seriesId,
      maskId,
      output3D,
    });
    console.log(response);
    return response;
  }

  async getMaskDicomOrientation(
    maskId: string,
    orientation: string,
    compress: boolean,
  ) {
    const downloadPath = tmpNameSync({ dir: './' });
    this.processingRequest.requestStreamResponseToFile(
      'POST',
      '/tools/mask-dicom',
      downloadPath,
      {},
      { maskId, orientation, compress },
    );
    return downloadPath;
  }

  async getStatsMask(maskId: string) {
    const response = await this.processingRequest.get(`/tools/${maskId}/stats`);
    console.log(response);
    return response;
  }

  async getStatsMaskSeries(maskId: string, seriesId: string) {
    const response = await this.processingRequest.get(
      `/tools/${maskId}/stats/${seriesId}`,
    );
    console.log(response);
    return response;
  }

  async deleteRessource(type: string, id: string) {
    const response = await this.processingRequest.delete(`/${type}/${id}`);
    console.log(response);
    return response;
  }
}
