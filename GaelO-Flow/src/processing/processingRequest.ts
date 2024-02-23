import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import OrthancClient from 'src/orthanc/OrthancClient';

export class ProcessingRequest {
  gaeloProcessingUrl: string = this.configService
    .get<string>('GAELO_PROCESSING_URL')
    .replace(/\/$/, '');
  gaeloProcessingLogin: string = this.configService.get<string>(
    'GAELO_PROCESSING_LOGIN',
  );
  gaeloProcessingPassword: string = this.configService.get<string>(
    'GAELO_PROCESSING_PASSWORD',
  );
  basicAuth: string = `Basic ${Buffer.from(
    `${this.gaeloProcessingLogin}:${this.gaeloProcessingPassword}`,
  ).toString('base64')}`;

  constructor(
    private readonly orthancClient: OrthancClient,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async post(url: string, data: any): Promise<any> {
    const request = this.httpService.post(
      `${this.gaeloProcessingUrl}${url}`,
      data,
      {
        headers: {
          Authorization: this.basicAuth,
        },
      },
    );
    return firstValueFrom(request);
  }

  async get(url: string): Promise<any> {
    const request = this.httpService.get(`${this.gaeloProcessingUrl}${url}`, {
      headers: {
        authorization: this.basicAuth,
      },
    });
    return firstValueFrom(request);
  }

  async delete(url: string): Promise<any> {
    const request = this.httpService.delete(
      `${this.gaeloProcessingUrl}${url}`,
      {
        headers: {
          authorization: this.basicAuth,
        },
      },
    );
    return firstValueFrom(request);
  }

  // async requestJson(method: string, url: string, data: []): Promise<any> {
  //   const request = this.httpService.request({
  //     method,
  //     url: `${this.gaeloProcessingUrl}${url}`,
  //     data,
  //     headers: {
  //       authorization: `Basic ${Buffer.from(
  //         `${this.gaeloProcessingLogin}:${this.gaeloProcessingPassword}`,
  //       ).toString('base64')}`,
  //     },
  //   });
  // }

  async uploadFile(uri: string, file: any): Promise<any> {
    const fileHandler = open(file, 'rb');

    const request = this.httpService.request({
      method: 'POST',
      url: `${this.gaeloProcessingUrl}${uri}`,
      headers: {
        authorization: this.basicAuth,
        'Content-Type': 'application/zip',
      },
      data: fileHandler,
      responseType: 'stream',
    });

    return firstValueFrom(request);
  }

  async requestStreamResponseToFile(
    method: string,
    uri: string,
    ressource,
    headers: any,
    body: any = {},
  ) {
    console.log('requestStreamResponseToFile');
    console.log(`${this.gaeloProcessingUrl}${uri}`);
    const request = this.httpService.request({
      method,
      url: `${this.gaeloProcessingUrl}${uri}`,
      headers: {
        authorization: this.basicAuth,
        ...headers,
      },
      data: body,
      responseType: 'stream',
    });

    try {
      const response = await firstValueFrom(request);
      const writer = ressource.getWritable();
      response.data.pipe(writer);
    } catch (e) {
      console.error(e);
    }
  }
}
