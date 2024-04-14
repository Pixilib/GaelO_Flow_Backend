import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';

import { Role } from './role.entity';
import { RoleLabel } from '../role-label/role-label.entity';
import { Label } from '../labels/label.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Label, RoleLabel])],
  providers: [RolesService],
  controllers: [RolesController],
})
export class RolesModule {}
