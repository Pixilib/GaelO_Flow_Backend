import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
/**
 * Guard checking requested Id in query is the same as userId calling
 */
@Injectable()
export class CheckUserIdQueryGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const value = request.query.userId;
    const userId = request.user.userId;

    return value == userId && value != undefined;
  }
}
