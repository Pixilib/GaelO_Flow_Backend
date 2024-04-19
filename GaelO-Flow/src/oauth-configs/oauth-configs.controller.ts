import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Public } from '../interceptors/public';
import { OauthConfigService } from './oauth-configs.service';
import { AdminGuard } from '../guards/roles.guard';
import { OauthConfigDto } from './oauth-config.dto';

@ApiTags('oauth-config')
@Controller('oauth-config')
export class OauthConfigController {
  constructor(private readonly oauthConfigService: OauthConfigService) {}

  @ApiResponse({
    status: 200,
    description: 'Oauth config returned',
    type: OauthConfigDto,
    isArray: true,
  })
  @Public()
  @Get()
  async getOauthConfig(): Promise<OauthConfigDto[]> {
    return await this.oauthConfigService.getOauthConfig();
  }

  @ApiResponse({ status: 200, description: 'Oauth config deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Oauth config not found' })
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'name', required: true })
  @UseGuards(AdminGuard)
  @Delete(':name')
  async deleteOauthConfig(@Param('name') name: string) {
    const config = await this.oauthConfigService.findOneByName(name);
    if (!config) throw new NotFoundException('Oauth config not found');

    return this.oauthConfigService.deleteOauthConfig(name);
  }

  @ApiResponse({ status: 201, description: 'Oauth config added' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Oauth config already exists' })
  @ApiBearerAuth('access-token')
  @ApiBody({ type: OauthConfigDto })
  @UseGuards(AdminGuard)
  @Post()
  async addOauthConfig(@Body() oauthConfigDto: OauthConfigDto) {
    const exists = await this.oauthConfigService.findOneByName(
      oauthConfigDto.Name,
    );
    if (exists) throw new ConflictException('Oauth config already exists');

    return this.oauthConfigService.addOauthConfig(oauthConfigDto);
  }
}
