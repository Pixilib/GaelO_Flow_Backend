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
} from 'src/guards/roles.guard';
import { StudyGuard } from 'src/guards/study.guard';

@ApiTags('orthanc')
@Controller()
export class OrthancController {
  constructor(private orthancClient: OrthancClient) {}

  @Get('/labels/:name/studies') // TODO check if name label is part of the labels associated to te user role -> create guard
  // @UseGuards() ???
  getStudiesWithLabel(@Param('name') labelName: string) {
    return this.orthancClient.findInOrthanc(
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
  }

  @ApiBearerAuth('access-token')
  @Get('/studies/*')
  @UseGuards(StudyGuard)
  getStudies(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @ApiBearerAuth('access-token')
  @Get('/series/*')
  // @UseGuards() ???
  getSeries(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @ApiBearerAuth('access-token')
  @Get('/instances/*')
  // @UseGuards() ???
  getInstances(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @ApiBearerAuth('access-token')
  @Get('/dicom-web/*')
  // @UseGuards() ???
  getDicomWeb(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @ApiBearerAuth('access-token')
  @Get('/wado/*')
  // @UseGuards() ???
  getWado(@Request() request: RequestType, @Response() response: ResponseType) {
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
