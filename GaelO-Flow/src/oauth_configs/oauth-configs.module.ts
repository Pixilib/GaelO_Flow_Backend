import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OauthConfigService } from './oauth-configs.service';
import { OauthConfigController } from './oauth-configs.controller';
import { OauthConfig } from './oauth-config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OauthConfig])],
  providers: [OauthConfigService],
  controllers: [OauthConfigController],
})
export class OauthConfigModule {}
