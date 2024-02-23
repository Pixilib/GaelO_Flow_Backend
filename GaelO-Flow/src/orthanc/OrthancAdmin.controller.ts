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
import { AdminGuard } from '../roles/roles.guard';

@ApiTags('orthanc')
@Controller()
export class OrthancAdminController {
  constructor(private orthancClient: OrthancClient) {}

  private doReverseProxy(request: RequestType, response: ResponseType) {
    const url = request.url;
    const method = request.method;
    const body = request.body;
    this.orthancClient.streamAnswerToRes(url, method, body, response);
  }

  @Get('/system')
  @UseGuards(AdminGuard)
  getSystem(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    this.doReverseProxy(request, response);
  }

  @Post('/tools/reset')
  @UseGuards(AdminGuard)
  resetOrthanc(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    this.doReverseProxy(request, response);
  }

  @Post('/tools/shutdown')
  @UseGuards(AdminGuard)
  shutdownOrthanc(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    this.doReverseProxy(request, response);
  }

  @Get('/tools/log-level')
  @UseGuards(AdminGuard)
  getLogLevel(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    this.doReverseProxy(request, response);
  }

  @Put('/tools/log-level')
  @UseGuards(AdminGuard)
  updateLogLevel(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    this.doReverseProxy(request, response);
  }

  @Get('/plugins')
  @UseGuards(AdminGuard)
  getPlugins(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    this.doReverseProxy(request, response);
  }

  @Post('/jobs/*')
  @UseGuards(AdminGuard)
  getJobs(@Request() request: RequestType, @Response() response: ResponseType) {
    this.doReverseProxy(request, response);
  }

  @Delete('/modalities/*')
  @UseGuards(AdminGuard)
  deleteModality(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    this.doReverseProxy(request, response);
  }

  @Post('/modalities/*/echo')
  @UseGuards(AdminGuard)
  createEcho(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    this.doReverseProxy(request, response);
  }

  @Put('/modalities/*')
  @UseGuards(AdminGuard)
  editModality(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    this.doReverseProxy(request, response);
  }

  @Delete('/peers/*')
  @UseGuards(AdminGuard)
  deletePeer(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    this.doReverseProxy(request, response);
  }

  @Get('/peers/*/system')
  @UseGuards(AdminGuard)
  getPeerSystem(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    this.doReverseProxy(request, response);
  }

  @Put('/peer/*/')
  @UseGuards(AdminGuard)
  editPeer(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    this.doReverseProxy(request, response);
  }
}
