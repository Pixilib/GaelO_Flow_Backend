import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OauthConfigService } from './oauth_configs.service';
import { OauthConfigController } from './oauth_configs.controller';
import { OauthConfig } from './oauth_config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OauthConfig])],
  providers: [OauthConfigService],
  controllers: [OauthConfigController],
})
export class OauthConfigModule {}
