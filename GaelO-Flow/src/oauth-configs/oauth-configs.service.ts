import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OauthConfig } from './oauth-config.entity';
import { OauthConfigDto } from './oauth-config.dto';

@Injectable()
export class OauthConfigService {
  constructor(
    @InjectRepository(OauthConfig)
    private oauthConfigsRepository: Repository<OauthConfig>,
  ) {}

  public async findOneByProvider(Provider: string): Promise<OauthConfig> {
    const config = await this.oauthConfigsRepository.findOne({
      where: { Provider },
    });
    return config;
  }

  public async findOneByAuthorizationUrl(
    AuthorizationUrl: string,
  ): Promise<OauthConfig> {
    const config = await this.oauthConfigsRepository.findOne({
      where: { AuthorizationUrl },
    });
    return config;
  }

  public async getOauthConfig(): Promise<OauthConfig[]> {
    const oauthConfig = await this.oauthConfigsRepository.find();
    return oauthConfig;
  }

  public async deleteOauthConfig(Provider: string) {
    await this.oauthConfigsRepository.delete({ Provider });
  }

  public async addOauthConfig(oauthConfigDto: OauthConfigDto) {
    const config = this.oauthConfigsRepository.create(oauthConfigDto);

    await this.oauthConfigsRepository.insert(config);
  }

  /* istanbul ignore next */
  public async seed() {
    const option = this.oauthConfigsRepository.create({
      Provider: 'keycloak',
      AuthorizationUrl:
        'http://localhost:8080/realms/master/protocol/openid-connect/auth',
      ClientId: 'back-end',
    });
    await this.oauthConfigsRepository.insert(option);
  }
}
