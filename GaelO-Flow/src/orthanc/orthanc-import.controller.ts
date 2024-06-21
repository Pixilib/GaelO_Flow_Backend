import {
  Controller,
  Response,
  UseGuards,
  Post,
  Request,
  RawBodyRequest,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response as ResponseType, Request as RequestType } from 'express';

import OrthancClient from '../utils/orthanc-client';
import { ImportGuard } from '../guards/roles.guard';
import { doReverseProxy } from './utils';
/**
 * Controller for reverse proxying route to importing resources routes in orthanc.
 */
@ApiTags('orthanc')
@Controller()
export class OrthancImportController {
  constructor(private orthancClient: OrthancClient) {}

  @ApiBearerAuth('access-token')
  @Post('/instances')
  @UseGuards(ImportGuard)
  createInstances(
    @Request() request: RawBodyRequest<RequestType>,
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
