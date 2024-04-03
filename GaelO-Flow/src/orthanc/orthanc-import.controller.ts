import { Controller, Response, Request, UseGuards, Post } from '@nestjs/common';
import { Response as ResponseType, Request as RequestType } from 'express';
import OrthancClient from './orthanc-client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ImportGuard } from '../guards/roles.guard';
import { doReverseProxy } from './utils';

@ApiTags('orthanc')
@Controller()
export class OrthancImportController {
  constructor(private orthancClient: OrthancClient) {}

  @ApiBearerAuth('access-token')
  @Post('/instances')
  @UseGuards(ImportGuard)
  createInstances(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @ApiBearerAuth('access-token')
  @Post('/tools/create-dicom')
  @UseGuards(ImportGuard)
  createDicom(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }
}
