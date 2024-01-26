import {
  Controller,
  Get,
  Response,
  Request,
  UseGuards,
  Post,
  Delete,
  Put,
} from '@nestjs/common';
import { Response as ResponseType, Request as RequestType } from 'express';
import OrthancClient from './OrthancClient';
import { ApiTags } from '@nestjs/swagger';
import { QueryGuard } from '../roles/roles.guard';

@ApiTags('orthanc')
@Controller()
export class OrthancQueryController {
  constructor(private orthancClient: OrthancClient) {}

  private doReverseProxy(request: RequestType, response: ResponseType) {
    const url = request.url;
    const method = request.method;
    const body = request.body;
    this.orthancClient.streamAnswerToRes(url, method, body, response);
  }

  @Post('/modalities/*/query')
  @UseGuards(QueryGuard)
  createModalitiesQuery(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    this.doReverseProxy(request, response);
  }

  @Get('/queries/*/answers*')
  @UseGuards(QueryGuard)
  getQueryAnswers(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    this.doReverseProxy(request, response);
  }

  // @Post('/retrieve')
  // @UseGuards(QueryGuard)
  // retrieve(
  //   @Request() request: RequestType,
  //   @Response() response: ResponseType,
  // ) {}
}
