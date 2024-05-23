import { ExecutionContext, Injectable } from '@nestjs/common';
import { StudyGuard } from './study.guard';
import { checkLabelRoleStudy } from '../utils/check-label-role-study';
/**
 * Guarding cheking called orthanc instance has a  parent study label belonging to user's calling role
 */
@Injectable()
export class InstanceGuard extends StudyGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userRole = request.user.role.Name;
    const orthancID = request.params.id;

    const parentStudy = await this.orthancClient
      .getParentStudy('instances', orthancID)
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
