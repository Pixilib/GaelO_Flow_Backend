import { CanActivate, ExecutionContext } from '@nestjs/common';

export class OrGuard implements CanActivate {
  constructor(private readonly guards: CanActivate[]) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    for (const guard of this.guards) {
      if (await guard.canActivate(context)) {
        return true;
      }
    }
    return false;
  }
}
