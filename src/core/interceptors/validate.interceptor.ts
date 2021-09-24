import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { IgnoredPropertyName } from '../decorators';
import { BaseError } from '../errors/base.error';
import { BaseDTO } from './base.dto';

export interface Response<T> {
  data: T;
}

@Injectable()
export class ValidateInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<Response<T>> {
    const isIgnored = context.getHandler()[IgnoredPropertyName];
    if (isIgnored) {
      return next.handle();
    }
    return next.handle().pipe(
      mergeMap(async (data) => {
        if (data) {
          if (data instanceof BaseDTO) {
            try {
              await data.validate();
            } catch (err) {
              console.log(JSON.stringify(err, null, 4));
              throw new BaseError(400, 0, 'Out validation failed');
            }
          } else {
            throw new BaseError(400, 0, 'Not instance of BaseDTO');
          }
        }

        return data;
      })
    );
  }
}
