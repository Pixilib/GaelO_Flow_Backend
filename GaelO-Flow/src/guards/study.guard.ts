import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { RolesService } from '../roles/roles.service';
import OrthancClient from '../utils/orthanc-client';

@Injectable()
export class StudyGuard implements CanActivate {
  constructor(
    protected roleService: RolesService,
    protected orthancClient: OrthancClient,
  ) {}

  protected async getStudyLabels(orthancID: string) {
    return this.orthancClient.listLabels('studies', orthancID).catch(() => {
      return [];
    });
  }

  protected async isStudyLabelInRole(
    userRole: string,
    orthancID: string,
  ): Promise<boolean> {
    const labelsOfRole = (await this.roleService.getRoleLabels(userRole)).map(
      (label) => label.Name,
    );
    const labelsOfStudy = await this.getStudyLabels(orthancID);

    return (
      labelsOfRole.filter((value) => labelsOfStudy.includes(value)).length > 0
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userRole = request.user.role.Name;
    const orthancID = request.params.id;

    return this.isStudyLabelInRole(userRole, orthancID);
  }
}
