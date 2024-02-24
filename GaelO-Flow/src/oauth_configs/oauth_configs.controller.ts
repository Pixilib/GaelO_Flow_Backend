import { Controller, Get, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../interceptors/Public';
import { OauthConfigService } from './oauth_configs.service';

@ApiTags('oauth-config')
@Controller('oauth-config')
export class OauthConfigController {
  constructor(private readonly oauthConfigService: OauthConfigService) {}

  @ApiResponse({ status: 200 })
  @Public()
  @Get()
  async getOauthConfig() {
    const oauthConfig = await this.oauthConfigService.getOauthConfig();
    const oauthConfigDto = {};
    for (const config of oauthConfig) {
      oauthConfigDto[config.provider] = { url: config.url, logo: config.logo };
    }

    return oauthConfigDto;
  }
}
