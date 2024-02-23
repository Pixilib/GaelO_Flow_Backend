import { Controller, Response, Request, UseGuards, Post } from '@nestjs/common';
import { Response as ResponseType, Request as RequestType } from 'express';
import OrthancClient from './OrthancClient';
import { ApiTags } from '@nestjs/swagger';
import { ModifyGuard } from '../roles/roles.guard';
import { doReverseProxy } from './Utils';

@ApiTags('orthanc')
@Controller()
export class OrthancModifyController {
  constructor(private orthancClient: OrthancClient) {}

  @Post('/modalities/*/modify')
  @UseGuards(ModifyGuard)
  createModalitiesModify(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @Post('/studies/*/modify')
  @UseGuards(ModifyGuard)
  createStudiesModify(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @Post('/series/*/modify')
  @UseGuards(ModifyGuard)
  createSeriesModify(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }
}
