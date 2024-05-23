import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RolesService } from '../roles/roles.service';
/**
 * Guard checking requested label belongs to user's role
 */
@Injectable()
export class CheckLabelInRole implements CanActivate {
  constructor(private rolesService: RolesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const labelName = request.params.labelName;
    const userRole = request.user.role.Name;
    const labelsOfRole = (await this.rolesService.getRoleLabels(userRole)).map(
      (label) => label.Name,
    );

    console.log('labelsOfRole', labelsOfRole);
    console.log('labelName', labelName);

    return labelsOfRole.includes(labelName);
  }
}
