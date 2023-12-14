import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// MAIN ROUTE
import { AppController } from './app.controller';
import { AppService } from './app.service';

// USER ROUTE
import { User } from './users/user.entity';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';

// ROLE ROUTE
import { Role } from './roles/role.entity';
import { RolesService } from './roles/roles.service';
import { RolesController } from './roles/roles.controller';

// OPTION ROUTE
import { Option } from './options/option.entity';
import { OptionsService } from './options/options.service';
import { OptionsController } from './options/options.controller';

// LDAP GROUP ROUTE
import { LdapGroupRole } from './ldap_group_roles/ldapgrouprole.entity';
import { LdapGroupRolesService } from './ldap_group_roles/ldapgrouproles.service';
import { LdapGroupRolesController } from './ldap_group_roles/ldapgrouproles.controller';

// LABEL ROUTE
import { Label } from './labels/label.entity';
import { LabelsController } from './labels/labels.controller';
import { LabelsService } from './labels/labels.service';

// AUTH ROUTE
import { AuthModule } from './auth/auth.module';

import { SeedService } from './seeder.service';
// QUEUES
import { OrthancController } from './orthanc/Orthanc.controller';
import OrthancClient from './orthanc/OrthancClient';

import { QueuesDeleteController } from './queues/delete/queueDeletes.controller';
import { QueuesDeleteService } from './queues/delete/queueDeletes.service';

import { QueuesAnonController } from './queues/anon/queueAnons.controller';
import { QueuesAnonService } from './queues/anon/queueAnons.service';

import { QueuesQueryController } from './queues/query/queueQuery.controller';
import { QueuesQueryService } from './queues/query/queueQuery.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<string>(
          'TYPEORM_TYPE',
          'postgres',
        ) as 'postgres', // Default to 'postgres'
        host: configService.get<string>('TYPEORM_HOST', 'localhost'),
        port: +configService.get<number>('TYPEORM_PORT', 5432),
        username: configService.get<string>('TYPEORM_USERNAME', 'postgres'),
        password: configService.get<string>('TYPEORM_PASSWORD', 'postgres'),
        database: configService.get<string>('TYPEORM_DATABASE', 'gaelo-flow'),
        entities: [User, Role, Option, LdapGroupRole, Label],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([User, Role, Option, LdapGroupRole, Label]),
    AuthModule
  ],
  controllers: [
    AppController,
    UsersController,
    RolesController,
    OptionsController,
    LdapGroupRolesController,
    LabelsController,
    OrthancController,
    QueuesDeleteController,
    QueuesAnonController,
    QueuesQueryController,
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
    QueuesDeleteService,
    QueuesAnonService,
    QueuesQueryService,
  ],
})
export class AppModule {}
