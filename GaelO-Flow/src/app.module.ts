import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthentificationController } from './controllers/authentification';
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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'gaelo-flow',
      entities: [User, Role, Option, LdapGroupRole, Label],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Role, Option, LdapGroupRole, Label]),
  ],
  controllers: [
    AppController,
    AuthentificationController,
    UsersController,
    RolesController,
    OptionsController,
    LdapGroupRolesController,
    LabelsController,
  ],
  providers: [
    AppService,
    SeedService,
    RolesService,
    UsersService,
    OptionsService,
    LdapGroupRolesService,
    LabelsService,
  ],
})
export class AppModule {}
