import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
/**
 * Guard cheking user has import permission
 */
@Injectable()
export class ImportGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return user && user.role.Import;
  }
}

/**
 * Guard cheking user has anonymize permission
 */
@Injectable()
export class AnonymizeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return user && user.role.Anonymize;
  }
}

/**
 * Guard cheking user has export permission
 */
@Injectable()
export class ExportGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return user && user.role.Export;
  }
}

/**
 * Guard cheking user has query permission
 */
@Injectable()
export class QueryGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return user && user.role.Query;
  }
}

/**
 * Guard cheking user has autoquery permission
 */
@Injectable()
export class AutoQueryGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return user && user.role.AutoQuery;
  }
}

/**
 * Guard cheking user has delete permission
 */
@Injectable()
export class DeleteGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return user && user.role.Delete;
  }
}

/**
 * Guard cheking user has admin permission
 */
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return user && user.role.Admin;
  }
}

/**
 * Guard cheking user has modify permission
 */
@Injectable()
export class ModifyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return user && user.role.Modify;
  }
}

/**
 * Guard cheking user has cdBurner permission
 */
@Injectable()
export class CdBurnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return user && user.role.CdBurner;
  }
}

/**
 * Guard cheking user has autorouting permission
 */
@Injectable()
export class AutoRoutingGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return user && user.role.AutoRouting;
  }
}

/**
 * Guard cheking user has readall permission
 */
@Injectable()
export class ReadAllGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return user && user.role.ReadAll;
  }
}
