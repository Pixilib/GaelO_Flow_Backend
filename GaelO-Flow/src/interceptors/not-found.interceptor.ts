import {
  NotFoundException,
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { EntityNotFoundError } from 'typeorm';

/**
 * This class is an interceptor that catches EntityNotFoundError exceptions and throws a HTTP NotFoundException instead.
 * This interceptor is registered globally in the main module.
 */
@Injectable()
export class NotFoundInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof EntityNotFoundError) {
          throw new NotFoundException(error.message);
        } else {
          throw error;
        }
      }),
    );
  }
}
