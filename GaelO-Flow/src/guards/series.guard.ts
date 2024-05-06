import { ExecutionContext, Injectable } from '@nestjs/common';
import { StudyGuard } from './study.guard';

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
    return this.isStudyLabelInRole(userRole, parentStudy.ID);
  }
}
