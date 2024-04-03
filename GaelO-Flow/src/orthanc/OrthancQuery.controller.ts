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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QueryGuard } from '../guards/roles.guard';
import { doReverseProxy } from './Utils';

@ApiTags('orthanc')
@Controller()
export class OrthancQueryController {
  constructor(private orthancClient: OrthancClient) {}

  @ApiBearerAuth('access-token')
  @Post('/modalities/*/query')
  @UseGuards(QueryGuard)
  createModalitiesQuery(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @ApiBearerAuth('access-token')
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
