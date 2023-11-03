import axios from 'axios';
import { Response } from 'express';

export class HttpClient {
  protected address: string;
  protected port: number;
  protected username: string;
  protected password: string;

  getOptions = (
    url: string,
    method: string,
    headers: object,
    data: object = undefined,
    getAsStream: boolean,
  ): object => {
    return {
      method: method,
      baseURL: this.address + ':' + this.port,
      url: url,
      auth: {
        username: this.username,
        password: this.password,
      },
      headers: {
        Forwarded:
          'by=localhost;for=localhost;host=' +
          process.env.DOMAIN_ADDRESS +
          '/api;proto=' +
          process.env.DOMAIN_PROTOCOL,
        ...headers,
      },
      data: data ?? undefined,
      responseType: getAsStream ? 'stream' : undefined,
    };
  };

  setAddress(address: string) {
    this.address = address;
  }

  setUsername(username: string) {
    this.username = username;
  }

  setPassword(password: string) {
    this.password = password;
  }

  setPort(port: number) {
    this.port = port;
  }

  request = (url, method, body, headers) => {
    const option = this.getOptions(url, method, body, headers, false);
    return axios.request(option).catch(function (error) {
      throw error;
    });
  };

  streamAnswerToRes = (url, method, body, headers, res: Response) => {
    const option = this.getOptions(url,method, body, headers, true);
    return axios
      .request(option)
      .then((response) => {
        res.setHeader('content-type', response.headers['content-type']);
        response.data.pipe(res);
      })
      .catch(function (error) {
        console.log(error)
        if (error.response) {
          if (error.response.status === 401) {
            res.status(500).send('Bad redentials');
          } else {
            res
              .status(error.response.status)
              .send(error.response.statusMessage);
          }
        }
      });
  };

  streamToWriteAnswerWithCallBack(
    url,
    method,
    body,
    streamWriter,
    finishCallBack,
  ) {
    const config = this.getOptions(url,method, body, {}, true);
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
}
