import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LabelsService } from './labels.service';
import { LabelsController } from './labels.controller';
import { Label } from './label.entity';
import { Role } from '../roles/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Label, Role])],
  providers: [LabelsService],
  controllers: [LabelsController],
})
export class LabelsModule {}
