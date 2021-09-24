import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiQueryOptions,
  ApiResponse,
  ApiSecurity
} from '@nestjs/swagger';
import { ApiOperationOptions } from '@nestjs/swagger/dist/decorators/api-operation.decorator';
import { ApiResponseOptions } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { SecurityRequirementObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { ApiBodyOptions } from '@nestjs/swagger/dist/decorators/api-body.decorator';

export const IgnoredPropertyName = Symbol('IgnoredPropertyName');

export interface PaginationData {
  offset: number;
  limit: number;
}

export const Pagination = createParamDecorator(
  (_1: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const limit = +request.query.limit || 1;
    const offset = +request.query.offset || 0;

    return { limit, offset };
  }
);

export function CustomInterceptorIgnore() {
  return function (_1, _2: string, descriptor: PropertyDescriptor) {
    descriptor.value[IgnoredPropertyName] = true;
  };
}

export interface SwaggerRouteDecoratorOptions {
  apiOperationData?: ApiOperationOptions;
  apiResponseData?: ApiResponseOptions;
  apiSecurityData?: string | SecurityRequirementObject;
  apiBodyData?: ApiBodyOptions;
  apiQueryOptions?: ApiQueryOptions[] | ApiQueryOptions;
}

export function SwaggerRouteDecorator(opts: SwaggerRouteDecoratorOptions) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const map = {
      apiOperationData: ApiOperation,
      apiResponseData: ApiResponse,
      apiSecurityData: ApiSecurity,
      apiBodyData: ApiBody,
      apiQueryOptions: ApiQuery
    };
    const decorators = [];

    for (const name of Object.keys(opts)) {
      const params = opts[name];
      if (params) {
        if (name === 'apiQueryOptions' && Array.isArray(params)) {
          for (const key of params) {
            decorators.push(map['apiQueryOptions'](key));
          }
        } else {
          decorators.push(map[name](params));
        }
      }
    }
    for (const key of decorators) {
      key(target, propertyKey, descriptor);
    }
  };
}
