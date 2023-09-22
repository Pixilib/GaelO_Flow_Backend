import { Body, Controller, Get, Post } from '@nestjs/common';
import { OptionsService } from './options.service';

@Controller()
export class OptionsController {
  constructor(private readonly OptionService: OptionsService) {}

  @Get()
  getHello(): string {
    return 'test';
  }
}
