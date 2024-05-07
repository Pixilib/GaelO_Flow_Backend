import {
  Controller,
  Get,
  Response,
  Request,
  Post,
  Delete,
  Put,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response as ResponseType, Request as RequestType } from 'express';

import OrthancClient from '../utils/orthanc-client';
import { doReverseProxy } from './utils';
import { OrGuard } from '../guards/or.guard';
import {
  AdminGuard,
  AutoQueryGuard,
  ExportGuard,
  QueryGuard,
  ReadAllGuard,
} from '../guards/roles.guard';
import { StudyGuard } from '../guards/study.guard';
import { DicomWebGuard } from '../guards/dicom-web.guard';
import { SeriesGuard } from '../guards/series.guard';
import { InstanceGuard } from '../guards/instance.guard';
import { CheckLabelInRole } from '../guards/check-label-in-role.guard';

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
    console.log('Answer', answer);
    return answer.data;
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
}
