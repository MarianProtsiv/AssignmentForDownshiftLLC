import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IgnoredPropertyName } from 'src/core/decorators/index';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isIgnored = context.getHandler()[IgnoredPropertyName];
    if (isIgnored) {
      return next.handle();
    }

    const start = Date.now();

    return next.handle().pipe(
      map((v) => ({
        responseTime: Date.now() - start,
        data: v
      }))
    );
  }
}
