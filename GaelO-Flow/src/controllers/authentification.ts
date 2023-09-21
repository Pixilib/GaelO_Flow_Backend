import { Controller, Get, Param, Post, Body } from '@nestjs/common';

@Controller('authentification')
export class AuthentificationController {
  @Get(':id')
  getHello(@Param('id') id: number): string {
    return 'coucou' + id;
  }

  @Post()
  createHello(@Body() body): string {
    return JSON.stringify(body);
  }
}
