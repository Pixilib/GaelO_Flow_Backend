import {
  Controller,
  Get,
  Response,
  Request,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Response as ResponseType, Request as RequestType } from 'express';

import OrthancClient from '../utils/orthanc-client';
import { doReverseProxy } from './utils';
import { OrGuard } from '../guards/or.guard';
import {
  AdminGuard,
  AnonymizeGuard,
  AutoQueryGuard,
  DeleteGuard,
  ExportGuard,
  ModifyGuard,
  QueryGuard,
  ReadAllGuard,
} from '../guards/roles.guard';
import { StudyGuard } from '../guards/study.guard';
import { DicomWebGuard } from '../guards/dicom-web.guard';
import { SeriesGuard } from '../guards/series.guard';
import { InstanceGuard } from '../guards/instance.guard';
import { CheckLabelInRole } from '../guards/check-label-in-role.guard';

/**
 * Controller for reverse proxying route to orthanc with custom guarding strategies.
 */
@ApiTags('orthanc')
@Controller()
export class OrthancController {
  constructor(private orthancClient: OrthancClient) {}

  @ApiBearerAuth('access-token')
  @Get('/labels/:labelName/studies')
  @UseGuards(CheckLabelInRole)
  async getStudiesWithLabel(@Param('labelName') labelName: string) {
    const answer = await this.orthancClient.findInOrthanc(
      'Study',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      [labelName],
    );
    return answer;
  }

  @ApiBearerAuth('access-token')
  @Get('/studies/*')
  @UseGuards(OrGuard([ReadAllGuard, StudyGuard]))
  getStudies(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @ApiBearerAuth('access-token')
  @Get('/series/*')
  @UseGuards(OrGuard([ReadAllGuard, SeriesGuard]))
  getSeries(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @ApiBearerAuth('access-token')
  @Get('/instances/*')
  @UseGuards(OrGuard([ReadAllGuard, InstanceGuard]))
  getInstances(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @ApiBearerAuth('access-token')
  @Get('/dicom-web/*')
  @UseGuards(OrGuard([ReadAllGuard, DicomWebGuard]))
  getDicomWeb(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @ApiBearerAuth('access-token')
  @Get('/modalities*')
  @UseGuards(OrGuard([AdminGuard, QueryGuard, AutoQueryGuard, ExportGuard]))
  getModalities(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'id',
    required: false,
    description: 'Gets the job id',
    allowEmptyValue: true,
  })
  
  @Get('/jobs/:id?')
  @UseGuards(
    OrGuard([
      AnonymizeGuard,
      AdminGuard,
      DeleteGuard,
      ModifyGuard,
      QueryGuard,
      AutoQueryGuard,
      ExportGuard,
      ReadAllGuard
    ]),
  )
  getJobs(@Request() request: RequestType, @Response() response: ResponseType) {
    doReverseProxy(request, response, this.orthancClient);
  }
}
