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

  /* istanbul ignore next */
  public async seed() {
    const option = this.oauthConfigsRepository.create({
      provider: ['keycloak'],
    });
    await this.oauthConfigsRepository.insert(option);
  }
}
