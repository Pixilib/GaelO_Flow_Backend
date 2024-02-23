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
import { ImportGuard } from '../roles/roles.guard';

@ApiTags('orthanc')
@Controller()
export class OrthancImportController {
  constructor(private orthancClient: OrthancClient) {}

  private doReverseProxy(request: RequestType, response: ResponseType) {
    const url = request.url;
    const method = request.method;
    const body = request.body;
    this.orthancClient.streamAnswerToRes(url, method, body, response);
  }

  @Post('/instances')
  @UseGuards(ImportGuard)
  createInstances(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    this.doReverseProxy(request, response);
  }

  @Post('/tools/create-dicom')
  @UseGuards(ImportGuard)
  createDicom(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    this.doReverseProxy(request, response);
  }
}
