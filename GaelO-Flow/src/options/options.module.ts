import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OptionsService } from './options.service';
import { OptionsController } from './options.controller';
import { Option } from './option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Option])],
  providers: [OptionsService, ConfigService],
  controllers: [OptionsController],
})
export class OptionsModule {}
