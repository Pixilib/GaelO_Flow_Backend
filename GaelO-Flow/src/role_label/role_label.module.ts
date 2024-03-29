import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleLabel } from './role_label.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoleLabel])],
})
export class RoleLabelModule {}
