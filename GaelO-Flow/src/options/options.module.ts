import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OptionsService } from './options.service';
import { OptionsController } from './options.controller';
import { Option } from './option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Option])],
  providers: [OptionsService],
  controllers: [OptionsController],
})
export class OptionsModule {}
