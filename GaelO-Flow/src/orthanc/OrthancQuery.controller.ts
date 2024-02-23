import {
  Controller,
  Get,
  Response,
  Request,
  UseGuards,
  Post,
} from '@nestjs/common';
import { Response as ResponseType, Request as RequestType } from 'express';
import OrthancClient from './OrthancClient';
import { ApiTags } from '@nestjs/swagger';
import { QueryGuard } from '../roles/roles.guard';
import { doReverseProxy } from './Utils';

@ApiTags('orthanc')
@Controller()
export class OrthancQueryController {
  constructor(private orthancClient: OrthancClient) {}

  @Post('/modalities/*/query')
  @UseGuards(QueryGuard)
  createModalitiesQuery(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @Get('/queries/*/answers*')
  @UseGuards(QueryGuard)
  getQueryAnswers(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  // @Post('/retrieve')
  // @UseGuards(QueryGuard)
  // retrieve(
  //   @Request() request: RequestType,
  //   @Response() response: ResponseType,
  // ) {}
}
