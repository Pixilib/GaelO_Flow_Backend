import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LabelsService } from './labels.service';
import { LabelsController } from './labels.controller';
import { Label } from './label.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Label])],
  providers: [LabelsService],
  controllers: [LabelsController],
})
export class LabelsModule {}
