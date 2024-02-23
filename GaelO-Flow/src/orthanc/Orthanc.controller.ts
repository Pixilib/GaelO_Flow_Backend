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
import { OrGuard } from '../utils/orGuards';
import {
  AdminGuard,
  AutoQueryGuard,
  ExportGuard,
  QueryGuard,
} from '../roles/roles.guard';

@ApiTags('orthanc')
@Controller()
export class OrthancController {
  constructor(private orthancClient: OrthancClient) {}

  private doReverseProxy(request: RequestType, response: ResponseType) {
    const url = request.url;
    const method = request.method;
    const body = request.body;
    this.orthancClient.streamAnswerToRes(url, method, body, response);
  }

  /*
  @Post('/modalities')
  @UseGuards(
    new OrGuard([
      new AdminGuard(),
      new QueryGuard(),
      new AutoQueryGuard(),
      new ExportGuard(),
    ]),
  )
  createInstances(
  */
  
  @ApiBearerAuth('access-token')
  @Get('/system')
  @UseGuards(AdminGuard)
  getSystem(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    this.doReverseProxy(request, response);
  }

  @ApiBearerAuth('access-token')
  @Post('/tools/reset')
  @UseGuards(AdminGuard)
  resetOrthanc(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    this.doReverseProxy(request, response);
  }

  @ApiBearerAuth('access-token')
  @Get('/jobs*')
  // @UseGuards() ???
  getJobs(@Request() request: RequestType, @Response() response: ResponseType) {
    this.doReverseProxy(request, response);
  }

  @ApiBearerAuth('access-token')
  @Post('/tools/find')
  // @UseGuards() ???
  find(@Request() request: RequestType, @Response() response: ResponseType) {
    this.doReverseProxy(request, response);
  }

  //SK Voir role pour la modification des labels
  @ApiBearerAuth('access-token')
  @Put('/studies/*/labels/*')
  // @UseGuards() ???
  updateLabels(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    this.doReverseProxy(request, response);
  }

  @ApiBearerAuth('access-token')
  @Delete('/studies/*/labels/*')
  // @UseGuards() ???
  deleteLabels(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    this.doReverseProxy(request, response);
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
  @Get('/patients/*')
  // @UseGuards() ???
  getPatients(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    this.doReverseProxy(request, response);
  }

  @Get('/studies/*')
  // @UseGuards() ???
  getStudies(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    this.doReverseProxy(request, response);
  }

  @Get('/series/*')
  // @UseGuards() ???
  getSeries(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    this.doReverseProxy(request, response);
  }

  @Get('/instances/*')
  // @UseGuards() ???
  getInstances(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    this.doReverseProxy(request, response);
  }

  @Get('/dicom-web/*')
  // @UseGuards() ???
  getDicomWeb(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    this.doReverseProxy(request, response);
  }

  @Get('/wado/*')
  // @UseGuards() ???
  getWado(@Request() request: RequestType, @Response() response: ResponseType) {
    this.doReverseProxy(request, response);
  }
}
