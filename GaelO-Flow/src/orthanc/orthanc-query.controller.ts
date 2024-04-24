import {
  Controller,
  Get,
  Response,
  Request,
  UseGuards,
  Post,
  Param,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response as ResponseType, Request as RequestType } from 'express';

import OrthancClient from '../utils/orthanc-client';
import { QueryGuard } from '../guards/roles.guard';
import { doReverseProxy } from './utils';
import {
  QueryParsedAnswerDto,
  QuerySeriesDto,
  QueryStudyDto,
} from './dto/query-parsed-answer.dto';
import { QueryAnswerType } from '../constants/enums';

@ApiTags('orthanc')
@Controller()
export class OrthancQueryController {
  constructor(private orthancClient: OrthancClient) {}

  @ApiBearerAuth('access-token')
  @Post('/modalities/*/query')
  @UseGuards(QueryGuard)
  createModalitiesQuery(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @ApiBearerAuth('access-token')
  @Get('/queries/*/answers*')
  @UseGuards(QueryGuard)
  getQueryAnswers(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @Post('/queries/:id/answers/:index/retrieve')
  @UseGuards(QueryGuard)
  retrieve(
    @Request() request: RequestType,
    @Response() response: ResponseType,
  ) {
    doReverseProxy(request, response, this.orthancClient);
  }

  @ApiBearerAuth('access-token')
  @Post('/modalities/:id/parsed-query')
  @UseGuards(QueryGuard)
  async getQueryParsedAnswer(
    @Param('id') id: string,
    @Body() queryParsedAnswer: QueryParsedAnswerDto,
  ) {
    if (queryParsedAnswer.Level == QueryAnswerType.LEVEL_SERIES) {
      const seriesDto = queryParsedAnswer.Query as QuerySeriesDto;
      const seriesDetails = await this.orthancClient.querySeriesInAet(
        seriesDto.StudyUID,
        seriesDto.Modality,
        seriesDto.ProtocolName,
        seriesDto.SeriesDescription,
        seriesDto.SeriesNumber,
        seriesDto.SeriesInstanceUID,
        id,
      );
      return seriesDetails;
    } else if (queryParsedAnswer.Level == QueryAnswerType.LEVEL_STUDY) {
      const studyDto = queryParsedAnswer.Query as QueryStudyDto;
      const studyDetails = await this.orthancClient.queryStudiesInAet(
        studyDto.PatientName,
        studyDto.PatientID,
        studyDto.StudyDate,
        studyDto.Modality,
        studyDto.StudyDescription,
        studyDto.AccessionNb,
        studyDto.StudyInstanceUID,
        id,
      );
      return studyDetails;
    }
  }
}
