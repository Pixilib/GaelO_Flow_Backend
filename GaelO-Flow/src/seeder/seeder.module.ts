import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { RolesService } from '../roles/roles.service';
import { UsersService } from '../users/users.service';
import { OptionsService } from '../options/options.service';
import { OauthConfigService } from '../oauth-configs/oauth-configs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Role } from '../roles/role.entity';
import { Label } from '../labels/label.entity';
import { OauthConfig } from '../oauth-configs/oauth-config.entity';
import { Autorouting } from '../autorouting/autorouting.entity';
import { Option } from '../options/option.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      Option,
      Label,
      OauthConfig,
      Autorouting,
    ]),
  ],
  providers: [
    SeederService,
    RolesService,
    UsersService,
    OptionsService,
    OauthConfigService,
  ],
  controllers: [],
})
export class SeederModule {}
