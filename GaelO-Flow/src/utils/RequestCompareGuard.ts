import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

/**
 * Compares the values of two nested properties of the request object.
 * @param valueAPath The path to the first value.
 * @param valueBPath The path to the second value.
 * @returns the guard will pass if the values are equal and not undefined.
 * @example new RequestCheckValues(['user', 'role', 'import'], ['user', 'role', 'export']) // -> will pass if request.user.role.import == request.user.role.export
 */
@Injectable()
export class RequestCheckValues implements CanActivate {
  constructor(
    private readonly valueAPath: string[],
    private readonly valueBPath: string[],
  ) {}

  getNestedProperty = (obj: any, pathArray: string[]) => {
    if (!obj) return undefined;
    return pathArray.reduce(
      (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
      obj,
    );
  };

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const valueA = this.getNestedProperty(request, this.valueAPath);
    const valueB = this.getNestedProperty(request, this.valueBPath);

    return valueA == valueB && valueA != undefined;
  }
}
