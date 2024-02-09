import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OauthConfig } from './oauth_config.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OauthConfigService {
  constructor(
    @InjectRepository(OauthConfig)
    private oauthConfigsRepository: Repository<OauthConfig>,
  ) {}

  public async getOauthConfig(): Promise<OauthConfig[]> {
    const oauthConfig = await this.oauthConfigsRepository.find();
    return oauthConfig;
  }

  /* istanbul ignore next */
  public async seed() {
    const option = this.oauthConfigsRepository.create({
      provider: 'keycloak',
      url: 'http://localhost:8080/realms/master/protocol/openid-connect/auth',
      logo: 'https://www.keycloak.org/resources/images/logo.svg',
    });
    await this.oauthConfigsRepository.insert(option);
  }
}
