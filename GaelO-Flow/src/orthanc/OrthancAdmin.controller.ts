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
import { ApiBearerAuth, ApiTags, ApiParam } from '@nestjs/swagger';
import { AdminGuard } from '../roles/roles.guard';
import { doReverseProxy } from './Utils';

@ApiTags('orthanc')
@Controller()
export class OrthancAdminController {
  constructor(private orthancClient: OrthancClient) {}

  @ApiBearerAuth('access-token')
  @Get('/system')
  @UseGuards(AdminGuard)
  getSystem(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @ApiBearerAuth('access-token')
  @Post('/tools/reset')
  @UseGuards(AdminGuard)
  resetOrthanc(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @ApiBearerAuth('access-token')
  @Post('/tools/shutdown')
  @UseGuards(AdminGuard)
  shutdownOrthanc(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @ApiBearerAuth('access-token')
  @Get('/tools/log-level')
  @UseGuards(AdminGuard)
  getLogLevel(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @ApiBearerAuth('access-token')
  @Put('/tools/log-level')
  @UseGuards(AdminGuard)
  updateLogLevel(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @ApiBearerAuth('access-token')
  @Get('/plugins')
  @UseGuards(AdminGuard)
  getPlugins(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @ApiBearerAuth('access-token')
  @Post('/jobs/*')
  @UseGuards(AdminGuard)
  createJobs(
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
  @UseGuards(AdminGuard)
  getJobs(@Request() request: RequestType, @Response() response: ResponseType) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @ApiBearerAuth('access-token')
  @Delete('/modalities/*')
  @UseGuards(AdminGuard)
  deleteModality(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @ApiBearerAuth('access-token')
  @Post('/modalities/*/echo')
  @UseGuards(AdminGuard)
  createEcho(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @ApiBearerAuth('access-token')
  @Put('/modalities/*')
  @UseGuards(AdminGuard)
  editModality(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @ApiBearerAuth('access-token')
  @Delete('/peers/*')
  @UseGuards(AdminGuard)
  deletePeer(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @ApiBearerAuth('access-token')
  @Get('/peers/*/system')
  @UseGuards(AdminGuard)
  getPeerSystem(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @ApiBearerAuth('access-token')
  @Put('/peer/*/')
  @UseGuards(AdminGuard)
  editPeer(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }
}
