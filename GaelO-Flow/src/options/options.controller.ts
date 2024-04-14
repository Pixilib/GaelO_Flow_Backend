import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { OptionsService } from './options.service';
import { Option } from './option.entity';
import { UpdateOptionDto } from './options.dto';
import { NotFoundInterceptor } from '../interceptors/not-found.interceptor';

import { AdminGuard } from '../guards/roles.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

@ApiTags('options')
@Controller('/options')
export class OptionsController {
  constructor(
    private readonly optionService: OptionsService,
    private readonly configService: ConfigService,
  ) {}

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Get all options', type: Option })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AdminGuard)
  @Get()
  async getOptions(): Promise<Option> {
    const options = await this.optionService.getOptions();
    delete options.Id;

    options['OrthancAddress'] = this.configService.get('ORTHANC_ADDRESS');
    options['OrthancPort'] = this.configService.get('ORTHANC_PORT');
    options['OrthancUsername'] = this.configService.get('ORTHANC_USERNAME');
    options['OrthancPassword'] = this.configService.get('ORTHANC_PASSWORD');
    options['RedisAddress'] = this.configService.get('REDIS_ADDRESS');
    options['RedisPort'] = this.configService.get('REDIS_PORT');

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
  async update(@Body() options: UpdateOptionDto): Promise<void> {
    return await this.optionService.update(options);
  }
}
