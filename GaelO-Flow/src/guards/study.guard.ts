import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { RolesService } from '../roles/roles.service';
import OrthancClient from '../utils/orthanc-client';
import { checkLabelRoleStudy } from '../utils/check-label-role-study';

@Injectable()
export class StudyGuard implements CanActivate {
  constructor(
    protected rolesService: RolesService,
    protected orthancClient: OrthancClient,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userRole = request.user.role.Name;
    const orthancID = request.params.id;

    return checkLabelRoleStudy(
      orthancID,
      userRole,
      this.rolesService,
      this.orthancClient,
    );
  }
}
