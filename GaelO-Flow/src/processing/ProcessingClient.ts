import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpClient } from '../utils/HttpClient';
import { Stream } from 'stream';

@Injectable()
class ProcessingClient extends HttpClient {

  constructor(
    private readonly configService: ConfigService,
  ) {
    super();
    this.setAddress(
      this.configService.get<string>('GAELO_PROCESSING_URL', 'http://localhost'),
    );
    this.setUsername(
      this.configService.get<string>('GAELO_PROCESSING_LOGIN', 'admin'),
    );
    this.setPassword(
      this.configService.get<string>('GAELO_PROCESSING_PASSWORD', 'admin'),
    );
  }

  createSeriesFromOrthanc(
    orthancSeriesId: string,
    pet: boolean = false,
    convertToSuv: boolean = false,
  ): Promise<any> {
    return this.request(
      '/tools/create-series-from-orthanc',
      'POST',
      { orthancSeriesId, pet, convertToSuv },
    );
  }

  async createDicom(stram: Stream) {
    return this.request(
      '/dicoms',
      'POST',
      stram,
    );
  }

  executeInference(modelName: string, payload: any): Promise<any> {
    return this.request(
      `/models/${modelName}/inference`,
      'POST',
      payload,
    );
  }

  createMIPForSeries(
    seriesId: string,
    payload: any = { orientation: 'LPI' },
  ) {
    return this.request(
      `/series/${seriesId}/mip`,
      'POST',
      payload,
    );
  }

  createMosaicForSeries(
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
    return this.request(
      `/series/${seriesId}/mosaic`,
      'POST',
      payload,
    );
  }

  getNiftiMask(maskId: string) {
    return this.requestStream(`/masks/${maskId}/file`, 'GET', null)
  }

  getNiftiSeries(imageId: string) {
    return this.requestStream(`/series/${imageId}/file`, 'GET', {});
  }

  createRtssFromMask(orthancSeriesId: string, maskId: string) {
    return this.request(
      '/tools/mask-to-rtss',
      'POST',
      {
        orthancSeriesId,
        maskId,
      });
  }

  getRtss(rtss: string) {
    return this.requestStream(`/rtss/${rtss}/file`, 'GET', null)
  }

  createSegFromMask(orthancSeriesId: string, maskId: string) {
    return this.request('/tools/mask-to-seg',
    'POST',
    {
      orthancSeriesId,
      maskId,
    });
  }

  getSeg(seg: string) {
    return this.requestStream(
      `/seg/${seg}/file`,
      'GET',
      {}
    );
  }

  thresholdMask(
    maskId: string,
    seriesId: string,
    threshold: string | number,
  ){
    return this.request(
      '/tools/threshold-mask',
      'POST',
      {
        maskId,
        seriesId,
        threshold,
      },
    );
  }

  fragmentMask(seriesId: string, maskId: string, output3D: boolean) {
    return this.request('/tools/fragment-mask', 'POST', {
      seriesId,
      maskId,
      output3D,
    });
  }

  getMaskDicomOrientation(
    maskId: string,
    orientation: string,
    compress: boolean,
  ) {
    return this.requestStream(
      '/tools/mask-dicom',
      'POST',
      { maskId, orientation, compress },
    );
  }

  async getStatsMask(maskId: string) {
    const response = await this.request(`/tools/${maskId}/stats`, 'GET', null);
    return response;
  }

  getStatsMaskSeries(maskId: string, seriesId: string) {
    return this.request(
      `/tools/${maskId}/stats/${seriesId}`,
      'GET',
      null
    );
  }

  deleteRessource(type: string, id: string) {
    return this.request(`/${type}/${id}`, 'DELETE', null);
  }
}

export default ProcessingClient
