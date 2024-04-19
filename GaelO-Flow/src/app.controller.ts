import { Controller, Get, Redirect } from '@nestjs/common';
import { Public } from './interceptors/public';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

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
}
