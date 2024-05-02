import { ExecutionContext, Injectable } from '@nestjs/common';
import { StudyGuard } from './study.guard';

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
    return this.isStudyLabelInRole(userRole, parentStudy.ID);
  }
}
