import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class CheckUserRoleGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const value = request.params.roleName;
    const userRole = request.user.role.Name;

    return value == userRole && value != undefined;
  }
}
