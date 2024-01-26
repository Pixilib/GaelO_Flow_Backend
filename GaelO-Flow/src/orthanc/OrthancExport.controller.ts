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
import { ExportGuard } from '../roles/roles.guard';

@ApiTags('orthanc')
@Controller()
export class OrthancExportController {
  constructor(private orthancClient: OrthancClient) {}

  private doReverseProxy(request: RequestType, response: ResponseType) {
    const url = request.url;
    const method = request.method;
    const body = request.body;
    this.orthancClient.streamAnswerToRes(url, method, body, response);
  }

  @Post('/modalities/*/store')
  @UseGuards(ExportGuard)
  createModalitiesExport(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    this.doReverseProxy(request, response);
  }

  @Post('/tools/create-archive')
  @UseGuards(ExportGuard)
  createArchive(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    this.doReverseProxy(request, response);
  }

  @Post('/tools/create-media')
  @UseGuards(ExportGuard)
  createMedia(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    this.doReverseProxy(request, response);
  }

  @Post('/tools/create-media-extended')
  @UseGuards(ExportGuard)
  createMediaExtended(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    this.doReverseProxy(request, response);
  }

  @Get('/peers*')
  @UseGuards(ExportGuard)
  getPeers(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    this.doReverseProxy(request, response);
  }

  @Post('/peers/*/store')
  @UseGuards(ExportGuard)
  createPeersStore(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    this.doReverseProxy(request, response);
  }

  @Post('/tasks/:user/export')
  @UseGuards(ExportGuard)
  createTasksUserExport(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    this.doReverseProxy(request, response);
  }
}
