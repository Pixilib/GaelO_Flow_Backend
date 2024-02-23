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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteGuard } from '../roles/roles.guard';

@ApiTags('orthanc')
@Controller()
export class OrthancDeleteController {
  constructor(private orthancClient: OrthancClient) {}

  private doReverseProxy(request: RequestType, response: ResponseType) {
    const url = request.url;
    const method = request.method;
    const body = request.body;
    this.orthancClient.streamAnswerToRes(url, method, body, response);
  }

  @Delete('/patients/*')
  @UseGuards(DeleteGuard)
  deletePatients(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    this.doReverseProxy(request, response);
  }

  @Delete('/studies/*')
  @UseGuards(DeleteGuard)
  deleteStudies(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    this.doReverseProxy(request, response);
  }

  @Delete('/series/*')
  @UseGuards(DeleteGuard)
  deleteSeries(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    this.doReverseProxy(request, response);
  }
}
