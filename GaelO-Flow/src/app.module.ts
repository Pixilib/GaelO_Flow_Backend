import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthentificationController } from './controllers/authentification';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Role } from './roles/role.entity';
import { Option } from './options/option.entity';
import { UsersController } from './users/users.controller';
import { RolesController } from './roles/roles.controller';
import { SeedService } from './seeder.service';
import { RolesService } from './roles/roles.service';
import { UsersService } from './users/users.service';
import { OptionsService } from './options/options.service';
import { LdapGroupRole } from './ldap_group_roles/ldapgrouprole.entity';
import { LdapGroupRolesService } from './ldap_group_roles/ldapgrouproles.service';
import { LdapGroupRolesController } from './ldap_group_roles/ldapgrouproles.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'gaelo-flow',
      entities: [User, Role, Option, LdapGroupRole],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Role, Option, LdapGroupRole]),
  ],
  controllers: [
    AppController,
    AuthentificationController,
    UsersController,
    RolesController,
    LdapGroupRolesController
  ],
  providers: [AppService, SeedService, RolesService, UsersService, OptionsService, LdapGroupRolesService],
})
export class AppModule {}
