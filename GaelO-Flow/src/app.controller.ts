import { Controller, Get, Post, Redirect, Req, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './interceptors/Public';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('oauth2-redirect.html')
  @Redirect('/docs/oauth2-redirect.html', 302)
  async oauth2Redirect(@Request() req: Request) {
    return { url: '/docs/oauth2-redirect.html' };
  }
}
