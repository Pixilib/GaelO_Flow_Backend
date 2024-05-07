import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
/**
 * Guard checking requested Id in param is the same as userId calling
 */
@Injectable()
export class CheckUserIdParamsGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const value = request.params.id;
    const userId = request.user.userId;

    return value == userId && value != undefined;
  }
}
