import axios from 'axios';
import { Response } from 'express';
import { Stream } from 'stream';

export class HttpClient {
  protected url: string;
  protected username: string;
  protected password: string;
  protected forwardedAddress: string;
  protected forwardedProtocol: string;

  getOptions = (
    url: string,
    method: string,
    headers: object,
    data: object | string | Buffer | any,
    getAsStream: boolean,
  ): object => {
    return {
      method: method,
      baseURL: this.url,
      url: url,
      auth: {
        username: this.username,
        password: this.password,
      },
      headers: {
        Forwarded:
          'by=localhost;for=localhost;host=' +
          this.forwardedAddress +
          '/api;proto=' +
          this.forwardedProtocol,
        ...headers,
      },
      data: data ?? undefined,
      responseType: getAsStream ? 'stream' : undefined,
    };
  };

  setForwardedAdress(address: string): void {
    this.forwardedAddress = address;
  }

  setForwardedProtocol(protocol: string): void {
    this.forwardedProtocol = protocol;
  }

  setUrl(url: string) {
    this.url = url;
  }

  setUsername(username: string) {
    this.username = username;
  }

  setPassword(password: string) {
    this.password = password;
  }

  request = (
    url: string,
    method: string,
    body: object | string | null | any,
    headers: object | undefined = undefined,
  ) => {
    const option = this.getOptions(url, method, headers, body, false);
    return axios.request(option).catch(function (error) {
      throw error;
    });
  };

  requestStream = (
    url: string,
    method: string,
    body: object | string | null,
    headers: object | undefined = undefined,
  ) => {
    const option = this.getOptions(url, method, headers, body, true);
    return axios.request(option).catch(function (error) {
      throw error;
    });
  };

  streamAnswerToRes = (
    url: string,
    method: string,
    body: object,
    res: Response,
    headers: object | undefined = undefined,
  ) => {
    const option = this.getOptions(url, method, headers, body, true);
    return axios
      .request(option)
      .then((response) => {
        res.setHeader('content-type', response.headers['content-type']);
        response.data.pipe(res);
      })
      .catch(function (error) {
        console.error(error);
        if (error.response) {
          if (error.response.status === 401) {
            res.status(500).send('Bad credentials');
          } else {
            res
              .status(error.response.status)
              .send(error.response.statusMessage);
          }
        }
      });
  };

  async streamToWriteAnswerWithCallBack(
    url: string,
    method: string,
    body: object,
    streamWriter: any,
    finishCallBack: any,
  ) {
    const config = this.getOptions(url, method, {}, body, true);
    return axios
      .request(config)
      .then((response) => {
        response.data.pipe(streamWriter).on('finish', () => {
          finishCallBack();
        });
      })
      .catch(function (error) {
        throw error;
      });
  }

  async getResponseAsStream(
    url: string,
    method: string,
    body: object | string = {},
  ): Promise<any> {
    const response = await this.requestStream(url, method, body);
    return response.data;
  }

  async getResponseAsBuffer(
    url: string,
    method: string,
    body: object | string = {},
  ): Promise<any> {
    const response = await this.request(url, method, body, {
      responseType: 'arraybuffer',
    });
    console.log('response', response);
    return Buffer.from(response.data, 'binary');
  }
}
