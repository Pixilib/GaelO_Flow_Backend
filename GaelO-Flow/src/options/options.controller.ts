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

import { AdminGuard } from '../roles/roles.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('options')
@Controller('/options')
export class OptionsController {
  constructor(private readonly OptionService: OptionsService) {}

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Get all options', type: Option })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AdminGuard)
  @Get()
  async getOptions(): Promise<Option> {
    const options = await this.OptionService.getOptions();
    delete options.id;
    return options;
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: 'Update options',
    type: UpdateOptionDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AdminGuard)
  @Patch()
  @UseInterceptors(NotFoundInterceptor)
  async update(@Body() options: UpdateOptionDto): Promise<void> {
    return await this.OptionService.update(options);
  }
}
