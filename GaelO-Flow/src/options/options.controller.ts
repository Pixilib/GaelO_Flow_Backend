import {
  Body,
  Controller,
  Get,
  Patch,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { OptionsService } from './options.service';
import { Option } from './option.entity';
import { UpdateOptionDto } from './options.dto';
import { NotFoundInterceptor } from '../interceptors/NotFoundInterceptor';

import { RolesGuard } from 'src/roles/roles.guard';
import { PermissionAdmin } from 'src/roles/roles.decorator';

@Controller('/options')
@UseGuards(RolesGuard)
export class OptionsController {
  constructor(private readonly OptionService: OptionsService) {}

  @PermissionAdmin()
  @Get()
  async getOptions(): Promise<Option> {
    let options = await this.OptionService.getOptions();
    delete options.id;
    return options;
  }

  @PermissionAdmin()
  @Patch()
  @UseInterceptors(NotFoundInterceptor)
  async update(@Body() options: UpdateOptionDto): Promise<void> {
    return await this.OptionService.update(options);
  }
}
