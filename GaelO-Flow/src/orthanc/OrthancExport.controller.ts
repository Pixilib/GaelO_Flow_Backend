import {
  Controller,
  Get,
  Response,
  Request,
  UseGuards,
  Post
} from '@nestjs/common';
import { Response as ResponseType, Request as RequestType } from 'express';
import OrthancClient from './OrthancClient';
import { ApiTags } from '@nestjs/swagger';
import { ExportGuard } from '../roles/roles.guard';
import { doReverseProxy } from './Utils';

@ApiTags('orthanc')
@Controller()
export class OrthancExportController {
  constructor(private orthancClient: OrthancClient) {}

  @Post('/modalities/*/store')
  @UseGuards(ExportGuard)
  createModalitiesExport(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @Post('/tools/create-archive')
  @UseGuards(ExportGuard)
  createArchive(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @Post('/tools/create-media')
  @UseGuards(ExportGuard)
  createMedia(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @Post('/tools/create-media-extended')
  @UseGuards(ExportGuard)
  createMediaExtended(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @Get('/peers*')
  @UseGuards(ExportGuard)
  getPeers(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @Post('/peers/*/store')
  @UseGuards(ExportGuard)
  createPeersStore(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @Post('/tasks/:user/export')
  @UseGuards(ExportGuard)
  createTasksUserExport(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }
}
