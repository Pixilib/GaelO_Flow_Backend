import { Controller, Response, Request, UseGuards, Post } from '@nestjs/common';
import { Response as ResponseType, Request as RequestType } from 'express';
import OrthancClient from './orthanc-client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ModifyGuard } from '../guards/roles.guard';
import { doReverseProxy } from './utils';

@ApiTags('orthanc')
@Controller()
export class OrthancModifyController {
  constructor(private orthancClient: OrthancClient) {}

  @ApiBearerAuth('access-token')
  @Post('/modalities/*/modify')
  @UseGuards(ModifyGuard)
  createModalitiesModify(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @ApiBearerAuth('access-token')
  @Post('/studies/*/modify')
  @UseGuards(ModifyGuard)
  createStudiesModify(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @ApiBearerAuth('access-token')
  @Post('/series/*/modify')
  @UseGuards(ModifyGuard)
  createSeriesModify(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }
}
