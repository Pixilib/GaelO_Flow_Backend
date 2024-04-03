import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class CheckUserRole implements CanActivate {
  constructor(private readonly valuePath: string[]) {}

  getNestedProperty = (obj: any, pathArray: string[]) => {
    if (!obj) return undefined;
    return pathArray.reduce(
      (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
      obj,
    );
  };

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const value = this.getNestedProperty(request, this.valuePath);
    const userRole = request.user.role.name;

    return value == userRole && value != undefined;
  }
}
