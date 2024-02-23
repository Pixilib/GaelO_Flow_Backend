import {
  Controller,
  Response,
  Request,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { Response as ResponseType, Request as RequestType } from 'express';
import OrthancClient from './OrthancClient';
import { ApiTags } from '@nestjs/swagger';
import { DeleteGuard } from '../roles/roles.guard';
import { doReverseProxy } from './Utils';

@ApiTags('orthanc')
@Controller()
export class OrthancDeleteController {
  constructor(private orthancClient: OrthancClient) {}


  @Delete('/patients/*')
  @UseGuards(DeleteGuard)
  deletePatients(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @Delete('/studies/*')
  @UseGuards(DeleteGuard)
  deleteStudies(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @Delete('/series/*')
  @UseGuards(DeleteGuard)
  deleteSeries(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }
}
