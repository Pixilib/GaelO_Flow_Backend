import { Injectable } from '@nestjs/common';

import { RolesService } from './roles/roles.service';
import { UsersService } from './users/users.service';
import { OptionsService } from './options/options.service';
import { OauthConfigService } from './oauth-configs/oauth-configs.service';

@Injectable()
export class SeedService {
  public constructor(
    private readonly rolesService: RolesService,
    private readonly usersService: UsersService,
    private readonly optionService: OptionsService,
    private readonly oauthConfigService: OauthConfigService,
  ) {}

  public async seed() {
    await this.rolesService.seed();
    await this.usersService.seed();
    await this.optionService.seed();
    await this.oauthConfigService.seed();
  }
}
