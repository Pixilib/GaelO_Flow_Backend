import { ExecutionContext, Injectable } from '@nestjs/common';
import { StudyGuard } from './study.guard';
import { checkLabelRoleStudy } from '../utils/check-label-role-study';

@Injectable()
export class SeriesGuard extends StudyGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userRole = request.user.role.Name;
    const orthancID = request.params.id;

    const parentStudy = await this.orthancClient
      .getParentStudy('series', orthancID)
      .catch(() => null);

    if (!parentStudy) return false;
    return checkLabelRoleStudy(
      parentStudy.ID,
      userRole,
      this.rolesService,
      this.orthancClient,
    );
  }
}
