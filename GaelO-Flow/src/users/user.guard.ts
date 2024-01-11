import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class UserIdGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userId = request.params.id;
    const authenticatedUserId = request.user.userId;

    return userId == authenticatedUserId;
  }
}
