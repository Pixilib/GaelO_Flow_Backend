import { Controller, Get, Post, Redirect, Req, Request } from '@nestjs/common';
import { Public } from './interceptors/public';
import { ApiExcludeController, ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor() {}

  @Public()
  @Get('oauth2-redirect.html')
  @Redirect('/docs/oauth2-redirect.html', 302)
  @ApiExcludeEndpoint()
  async oauth2Redirect(@Request() req: Request) {
    return { url: '/docs/oauth2-redirect.html' };
  }
}
