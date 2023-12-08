import { Controller, Get, Response, Request } from '@nestjs/common';
import { Response as ResponseType, Request as RequestType } from 'express';
import OrthancClient from './OrthancClient';

@Controller()
export class OrthancController {
  constructor(private orthancClient: OrthancClient) {}

  private doReverseProxy(request: RequestType, response: ResponseType) {
    const url = request.url;
    const method = request.method;
    const body = request.body;
    this.orthancClient.streamAnswerToRes(
      url,
      method,
      body,
      response
    );
  }

  @Get('/system')
  reverseProxy(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    this.doReverseProxy(request, response);
  }
}
