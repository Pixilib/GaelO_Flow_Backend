import {
  Body,
  Controller,
  Get,
  Patch,
  UseInterceptors
} from '@nestjs/common';
import { OptionsService } from './options.service';
import { Option } from './option.entity';
import { UpdateOptionDto } from './options.dto';
import { NotFoundInterceptor } from '../interceptors/NotFoundInterceptor';

@Controller('/options')
export class OptionsController {
  constructor(private readonly OptionService: OptionsService) {}

  @Get()
  async getOptions(): Promise<Option> {
    let options = await this.OptionService.getOptions();
    delete options.id;
    return options;
  }

  @Patch()
  @UseInterceptors(NotFoundInterceptor)
  async update(@Body() options: UpdateOptionDto): Promise<void> {
    return await this.OptionService.update(options);
  }
}
