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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrGuard } from '../utils/orGuards';
import {
  AdminGuard,
  AutoQueryGuard,
  ExportGuard,
  QueryGuard,
} from '../roles/roles.guard';
import { doReverseProxy } from './Utils';

@ApiTags('orthanc')
@Controller()
export class OrthancController {
  constructor(private orthancClient: OrthancClient) {}

  @ApiBearerAuth('access-token')
  @Post('/tools/find')
  // @UseGuards() ???
  find(@Request() request: RequestType, @Response() response: ResponseType) {
    doReverseProxy(request, response, this.orthancClient);
  }

  //SK Voir role pour la modification des labels
  @ApiBearerAuth('access-token')
  @Put('/studies/*/labels/*')
  // @UseGuards() ???
  updateLabels(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @ApiBearerAuth('access-token')
  @Delete('/studies/*/labels/*')
  // @UseGuards() ???
  deleteLabels(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  // //Get dicoms studyes according to labels
  // @Get('/labels/:name/studies')
  // // @UseGuards() ???
  // getStudiesWithLabel(
  //   @Request() request: RequestType,
  //   @Response() response: ResponseType,
  // ) {}

  //Reverse Proxy Routes for orthanc content => Warning non RBAC Protected
  //SK A VERIFIER QUE LES RACINES SONT BIEN VEROUILLEES
  @ApiBearerAuth('access-token')
  @Get('/patients/*')
  // @UseGuards() ???
  getPatients(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @ApiBearerAuth('access-token')
  @Get('/studies/*')
  // @UseGuards() ???
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
}
