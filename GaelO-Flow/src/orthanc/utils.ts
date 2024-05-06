import { Request, Response } from 'express';
import OrthancClient from '../utils/orthanc-client';

export const doReverseProxy = (
  request: Request,
  response: Response,
  orthancClient: OrthancClient,
) => {
  const url = request.url;
  const orthancCalledApi = url.replace('/api', '');
  const method = request.method;
  const body = request.body;
  orthancClient.streamAnswerToRes(orthancCalledApi, method, body, response, {
    accept: request.headers.accept,
  });
};
