import { Injectable } from '@nestjs/common';
import { RolesService } from './roles/roles.service';
import { UsersService } from './users/users.service';
import { OptionsService } from './options/options.service';
import { QueuesDeleteService } from './queues/delete/queueDeletes.service';

@Injectable()
export class SeedService {
  public constructor(
    private readonly rolesService: RolesService,
    private readonly usersService: UsersService,
    private readonly optionService: OptionsService,
    private readonly queuesService: QueuesDeleteService,
  ) {
    this.rolesService = rolesService;
    this.usersService = usersService;
    this.optionService = optionService;
    this.queuesService = queuesService;
  }

  public async seed() {
    await this.queuesService.seed();
    await this.rolesService.seed();
    await this.usersService.seed();
    await this.optionService.seed();
  }
}
