import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpClient } from './http.client';

@Injectable()
class ProcessingClient extends HttpClient {
  constructor(private readonly configService: ConfigService) {
    super();
    this.setUrl(this.configService.get<string>('GAELO_PROCESSING_URL'));
    this.setUsername(this.configService.get<string>('GAELO_PROCESSING_LOGIN'));
    this.setPassword(
      this.configService.get<string>('GAELO_PROCESSING_PASSWORD'),
    );
  }

  createSeriesFromOrthanc(
    orthancSeriesId: string,
    pet: boolean = false,
    convertToSuv: boolean = false,
  ): Promise<string> {
    return this.request('/tools/create-series-from-orthanc', 'POST', {
      seriesId: orthancSeriesId,
      pet,
      convertToSuv,
    }).then((response) => response.data);
  }

  createDicom(stream: any): Promise<string> {
    return this.request('/dicoms', 'POST', stream, {
      'Content-Type': 'application/zip',
    }).then((response) => response.data);
  }

  executeInference(modelName: string, payload: any): Promise<string> {
    return this.request(`/models/${modelName}/inference`, 'POST', payload).then(
      (response) => response.data,
    );
  }

  createMIPForSeries(
    seriesId: string,
    payload: any = { orientation: 'LPI' },
  ): Promise<any> {
    return this.requestStream(`/series/${seriesId}/mip`, 'POST', payload).then(
      (response) => response.data,
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
  ): Promise<any> {
    return this.requestStream(
      `/series/${seriesId}/mosaic`,
      'POST',
      payload,
    ).then((response) => response.data);
  }

  getNiftiMask(maskId: string): Promise<any> {
    return this.requestStream(`/masks/${maskId}/file`, 'GET', null).then(
      (response) => response.data,
    );
  }

  getNiftiSeries(imageId: string): Promise<any> {
    return this.requestStream(`/series/${imageId}/file`, 'GET', {}).then(
      (response) => response.data,
    );
  }

  createRtssFromMask(orthancSeriesId: string, maskId: string): Promise<string> {
    return this.request('/tools/mask-to-rtss', 'POST', {
      orthancSeriesId,
      maskId,
    }).then((response) => response.data);
  }

  getRtss(rtss: string): Promise<any> {
    return this.requestStream(`/rtss/${rtss}/file`, 'GET', {}).then(
      (response) => response.data,
    );
  }

  createSegFromMask(orthancSeriesId: string, maskId: string): Promise<string> {
    return this.request('/tools/mask-to-seg', 'POST', {
      orthancSeriesId,
      maskId,
    }).then((response) => response.data);
  }

  getSeg(seg: string): Promise<any> {
    return this.requestStream(`/seg/${seg}/file`, 'GET', {}).then(
      (response) => response.data,
    );
  }

  thresholdMask(
    maskId: string,
    seriesId: string,
    threshold: string | number,
  ): Promise<string> {
    return this.request('/tools/threshold-mask', 'POST', {
      maskId,
      seriesId,
      threshold,
    }).then((response) => response.data);
  }

  fragmentMask(
    seriesId: string,
    maskId: string,
    output3D: boolean,
  ): Promise<string> {
    return this.request('/tools/mask-fragmentation', 'POST', {
      seriesId,
      maskId,
      output3D,
    }).then((response) => response.data);
  }

  getMaskDicomOrientation(
    maskId: string,
    orientation: string,
    compress: boolean,
  ): Promise<any> {
    return this.requestStream('/tools/mask-dicom', 'POST', {
      maskId,
      orientation,
      compress,
    }).then((response) => response.data);
  }

  getStatsMask(maskId: string): Promise<object> {
    return this.request(`/masks/${maskId}/stats`, 'GET', null).then(
      (response) => response.data,
    );
  }

  getStatsMaskSeries(maskId: string, seriesId: string): Promise<object> {
    return this.request(`/tools/stats-mask-image`, 'POST', {
      seriesId,
      maskId,
    }).then((response) => response.data);
  }

  deleteRessource(type: string, id: string) {
    return this.request(`/${type}/${id}`, 'DELETE', null).then(() => true);
  }
}

export default ProcessingClient;
