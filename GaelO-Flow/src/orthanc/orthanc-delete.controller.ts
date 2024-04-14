import {
  Controller,
  Response,
  Request,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response as ResponseType, Request as RequestType } from 'express';

import OrthancClient from '../utils/orthanc-client';
import { DeleteGuard } from '../guards/roles.guard';
import { doReverseProxy } from './utils';

@ApiTags('orthanc')
@Controller()
export class OrthancDeleteController {
  constructor(private orthancClient: OrthancClient) {}

  @ApiBearerAuth('access-token')
  @Delete('/patients/*')
  @UseGuards(DeleteGuard)
  deletePatients(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @ApiBearerAuth('access-token')
  @Delete('/studies/*')
  @UseGuards(DeleteGuard)
  deleteStudies(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @ApiBearerAuth('access-token')
  @Delete('/series/*')
  @UseGuards(DeleteGuard)
  deleteSeries(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }
}
