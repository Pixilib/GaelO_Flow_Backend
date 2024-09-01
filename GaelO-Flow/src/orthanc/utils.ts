import { Request, Response } from 'express';
import OrthancClient from '../utils/orthanc-client';
import { RawBodyRequest } from '@nestjs/common';

/**
 * Utility function to reverse proxy a request to orthanc.
 * @param request
 * @param response
 * @param orthancClient
 */
export const doReverseProxy = (
  request: Request | RawBodyRequest<Request>,
  response: Response,
  orthancClient: OrthancClient,
) => {
  const url = request.url;
  const orthancCalledApi = url.replace('/api', '');
  const method = request.method;
  const body = request.body;
  orthancClient.streamAnswerToRes(orthancCalledApi, method, body, response, {
    'Content-Type': request.headers['content-type'],
    accept: request.headers.accept,
  });
};
