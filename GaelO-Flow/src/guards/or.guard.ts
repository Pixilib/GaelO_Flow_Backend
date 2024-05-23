// from: https://github.com/jmcdo29/nest-lab/blob/main/packages/or-guard/src/lib/or.guard.ts

import {
  CanActivate,
  ExecutionContext,
  Inject,
  InjectionToken,
  mixin,
  Type,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  defer,
  from,
  Observable,
  of,
  OperatorFunction,
  throwError,
} from 'rxjs';
import { catchError, last, mergeMap, takeWhile } from 'rxjs/operators';

interface OrGuardOptions {
  throwOnFirstError?: boolean;
}

/**
 * Guard testing an array of guards, activate at the first guard activation granted
 * @param guards Array of guards to be tested
 * @param orGuardOptions {throwOnFirstError : optional}
 * @returns Guard
 */
export function OrGuard(
  guards: Array<Type<CanActivate> | InjectionToken>,
  orGuardOptions?: OrGuardOptions,
) {
  class OrMixinGuard implements CanActivate {
    public guards: CanActivate[] = [];
    constructor(@Inject(ModuleRef) private readonly modRef: ModuleRef) {}

    //For testing purposes only
    __getGuards = () => guards;

    canActivate(context: ExecutionContext): Observable<boolean> {
      this.guards = guards.map((guard) =>
        this.modRef.get(guard, { strict: false }),
      );
      const canActivateReturns: Array<Observable<boolean>> = this.guards.map(
        (guard) => this.deferGuard(guard, context),
      );
      return from(canActivateReturns).pipe(
        mergeMap((obs) => {
          return obs.pipe(this.handleError());
        }),
        takeWhile((val) => val === false, true),
        last(),
      );
    }

    private deferGuard(
      guard: CanActivate,
      context: ExecutionContext,
    ): Observable<boolean> {
      return defer(() => {
        const guardVal = guard.canActivate(context);
        if (this.guardIsPromise(guardVal)) {
          return from(guardVal);
        }
        if (this.guardIsObservable(guardVal)) {
          return guardVal;
        }
        return of(guardVal);
      });
    }

    private handleError(): OperatorFunction<boolean, boolean> {
      return catchError((err) => {
        if (orGuardOptions?.throwOnFirstError) {
          return throwError(() => err);
        }
        return of(false);
      });
    }

    private guardIsPromise(
      guard: boolean | Promise<boolean> | Observable<boolean>,
    ): guard is Promise<boolean> {
      return !!(guard as Promise<boolean>).then;
    }

    private guardIsObservable(
      guard: boolean | Observable<boolean>,
    ): guard is Observable<boolean> {
      return !!(guard as Observable<boolean>).pipe;
    }
  }

  const Guard = mixin(OrMixinGuard);
  return Guard as Type<CanActivate>;
}
