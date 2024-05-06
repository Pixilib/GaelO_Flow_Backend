import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';

import { Role } from './role.entity';
import { Label } from '../labels/label.entity';
import { LabelsService } from '../labels/labels.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Label, User])],
  providers: [RolesService, LabelsService, UsersService],
  controllers: [RolesController],
  exports: [RolesService],
})
export class RolesModule {}
