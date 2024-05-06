import { Controller, Get, Redirect, UseGuards } from '@nestjs/common';
import { Public } from './interceptors/public';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiParam } from '@nestjs/swagger';
import { StudyGuard } from './guards/study.guard';
import { SeriesGuard } from './guards/series.guard';
import { InstanceGuard } from './guards/instance.guard';
import { OrGuard } from './guards/or.guard';

@Controller()
export class AppController {
  constructor() {}

  @Public()
  @Get('oauth2-redirect.html')
  @Redirect('/docs/oauth2-redirect.html', 302)
  @ApiExcludeEndpoint()
  async oauth2Redirect() {
    return { url: '/docs/oauth2-redirect.html' };
  }

  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', required: true })
  @UseGuards(OrGuard([InstanceGuard, SeriesGuard, StudyGuard]))
  @Get('TEST/:id')
  async test() {
    return 'Working!';
  }
}
