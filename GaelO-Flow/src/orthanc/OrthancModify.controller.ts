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
import { ModifyGuard } from '../roles/roles.guard';

@ApiTags('orthanc')
@Controller()
export class OrthancModifyController {
  constructor(private orthancClient: OrthancClient) {}

  private doReverseProxy(request: RequestType, response: ResponseType) {
    const url = request.url;
    const method = request.method;
    const body = request.body;
    this.orthancClient.streamAnswerToRes(url, method, body, response);
  }

  @Post('/modalities/*/modify')
  @UseGuards(ModifyGuard)
  createModalitiesModify(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    this.doReverseProxy(request, response);
  }

  @Post('/studies/*/modify')
  @UseGuards(ModifyGuard)
  createStudiesModify(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    this.doReverseProxy(request, response);
  }

  @Post('/series/*/modify')
  @UseGuards(ModifyGuard)
  createSeriesModify(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    this.doReverseProxy(request, response);
  }
}
