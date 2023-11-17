import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './users/user.entity';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';

import { Role } from './roles/role.entity';
import { RolesService } from './roles/roles.service';
import { RolesController } from './roles/roles.controller';

import { Option } from './options/option.entity';
import { OptionsService } from './options/options.service';
import { OptionsController } from './options/options.controller';

import { LdapGroupRole } from './ldap_group_roles/ldapgrouprole.entity';
import { LdapGroupRolesService } from './ldap_group_roles/ldapgrouproles.service';
import { LdapGroupRolesController } from './ldap_group_roles/ldapgrouproles.controller';

import { Label } from './labels/label.entity';
import { LabelsController } from './labels/labels.controller';
import { LabelsService } from './labels/labels.service';

import { SeedService } from './seeder.service';
import { AuthModule } from './auth/auth.module';

import { ConfigModule } from '@nestjs/config';
import { OrthancController } from './orthanc/Orthanc.controller';
import OrthancClient from './orthanc/OrthancClient';

import { QueuesModule } from './queues/queues.module';
import { QueuesController } from './queues/queues.controller';
import { QueuesService } from './queues/queues.service';

import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres', // TODO: from env variable
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'gaelo-flow',
      entities: [User, Role, Option, LdapGroupRole, Label],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Role, Option, LdapGroupRole, Label]),
    AuthModule,
    QueuesModule, // ?
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'delete',
    }),
  ],
  controllers: [
    AppController,
    UsersController,
    RolesController,
    OptionsController,
    LdapGroupRolesController,
    LabelsController,
    OrthancController,
    QueuesController,
  ],
  providers: [
    AppService,
    SeedService,
    RolesService,
    UsersService,
    OptionsService,
    LdapGroupRolesService,
    LabelsService,
    OrthancClient,
    QueuesService,
  ],
})
export class AppModule {}
