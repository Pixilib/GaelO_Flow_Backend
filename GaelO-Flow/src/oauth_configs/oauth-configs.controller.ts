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
import { Public } from '../interceptors/Public';
import { OauthConfigService } from './oauth-configs.service';
import { AdminGuard } from '../guards/roles.guard';
import { OauthConfigDto } from './oauth-config.dto';

@ApiTags('oauth-config')
@Controller('oauth-config')
export class OauthConfigController {
  constructor(private readonly oauthConfigService: OauthConfigService) {}

  @ApiResponse({ status: 200, description: 'Oauth config returned' })
  @Public()
  @Get()
  async getOauthConfig() {
    const oauthConfig = await this.oauthConfigService.getOauthConfig();
    const oauthConfigDto = {};
    for (const config of oauthConfig) {
      oauthConfigDto[config.Provider] = {
        AuthorizationUrl: config.AuthorizationUrl,
        ClientId: config.ClientId,
      };
    }

    return oauthConfigDto;
  }

  @ApiResponse({ status: 200, description: 'Oauth config deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Oauth config not found' })
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'provider', required: true })
  @UseGuards(AdminGuard)
  @Delete(':provider')
  async deleteOauthConfig(@Param('provider') provider: string) {
    const config = await this.oauthConfigService.findOneByProvider(provider);
    if (!config) throw new NotFoundException('Oauth config not found');

    return this.oauthConfigService.deleteOauthConfig(provider);
  }

  @ApiResponse({ status: 201, description: 'Oauth config added' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Oauth config already exists' })
  @ApiBearerAuth('access-token')
  @ApiBody({ type: OauthConfigDto })
  @UseGuards(AdminGuard)
  @Post()
  async addOauthConfig(@Body() oauthConfigDto: OauthConfigDto) {
    const exists = await this.oauthConfigService.findOneByProvider(
      oauthConfigDto.Provider,
    );
    if (exists) throw new ConflictException('Oauth config already exists');

    return this.oauthConfigService.addOauthConfig(oauthConfigDto);
  }
}
