import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { RolesService } from '../roles/roles.service';

import { UsersController } from './users.controller';

import { User } from './user.entity';
import { Role } from '../roles/role.entity';
import { Label } from '../labels/label.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Label])],
  providers: [UsersService, RolesService],
  controllers: [UsersController],
})
export class UsersModule {}
