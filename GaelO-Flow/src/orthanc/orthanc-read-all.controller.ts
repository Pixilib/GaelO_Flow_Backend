import {
  Controller,
  Get,
  Response,
  Request,
  Post,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response as ResponseType, Request as RequestType } from 'express';

import OrthancClient from '../utils/orthanc-client';
import { doReverseProxy } from './utils';
import { ReadAllGuard } from '../guards/roles.guard';

@ApiTags('orthanc')
@Controller()
export class OrthancReadAllController {
  constructor(private orthancClient: OrthancClient) {}

  @ApiBearerAuth('access-token')
  @Put('/studies/*/labels/*')
  @UseGuards(ReadAllGuard)
  updateLabels(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @ApiBearerAuth('access-token')
  @Delete('/studies/*/labels/*')
  @UseGuards(ReadAllGuard)
  deleteLabels(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @ApiBearerAuth('access-token')
  @Post('/tools/find')
  @UseGuards(ReadAllGuard)
  find(@Request() request: RequestType, @Response() response: ResponseType) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @ApiBearerAuth('access-token')
  @Get('/patients/*')
  @UseGuards(ReadAllGuard)
  getPatients(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }
}
