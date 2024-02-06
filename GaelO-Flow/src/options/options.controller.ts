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
    delete options.id;

    const valuesToRetrieve = {
      ORTHANC_ADDRESS: 'orthanc_address',
      ORTHANC_PORT: 'orthanc_port',
      ORTHANC_USERNAME: 'orthanc_username',
      ORTHANC_PASSWORD: 'orthanc_password',
      REDIS_ADDRESS: 'redis_address',
      REDIS_PORT: 'redis_port',
    };

    Object.keys(valuesToRetrieve).forEach((key) => {
      options[valuesToRetrieve[key]] = this.configService.get(key);
    });

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
    return await this.optionService.update(options);
  }
}
