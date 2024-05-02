import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class CheckUserIdParamsGuard implements CanActivate {
  constructor(private readonly valuePath: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const value = request.params.id;
    const userId = request.user.userId;

    return value == userId && value != undefined;
  }
}
