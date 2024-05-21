import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { OptionsService } from './options.service';
import { UpdateOptionDto } from './dto/update-option.dto';

import { AdminGuard } from '../guards/roles.guard';
import { GetOptionDto } from './dto/get-option.dto';

@ApiTags('options')
@Controller('/options')
export class OptionsController {
  constructor(
    private readonly optionService: OptionsService,
    private readonly configService: ConfigService,
  ) {}

  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: 'Get all options',
    type: GetOptionDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AdminGuard)
  @Get()
  async getOptions(): Promise<GetOptionDto> {
    const { Id, ...options } = await this.optionService.getOptions();
    const getOptionDto: GetOptionDto = {
      ...options,
      OrthancAddress: this.configService.get('ORTHANC_ADDRESS'),
      OrthancUsername: this.configService.get('ORTHANC_USERNAME'),
      OrthancPassword: this.configService.get('ORTHANC_PASSWORD'),
      RedisAddress: this.configService.get('REDIS_ADDRESS'),
      RedisPort: this.configService.get('REDIS_PORT'),
    };

    return getOptionDto;
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
