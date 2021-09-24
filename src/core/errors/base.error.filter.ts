import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  Injectable,
  Logger
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseError } from 'src/core/errors/base.error';
import { ConfigService, Enviroment } from 'src/config/config.service';

interface ErrorBody {
  statusCode: number;
  errorCode: number;
  path: string;
  error: string | Record<string, any>;
}

@Injectable()
export class BaseErrorFilter implements ExceptionFilter {
  constructor(private logger: Logger, private config: ConfigService) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const body: ErrorBody = {
      statusCode: 500,
      errorCode: 0,
      path: request.url,
      error: null
    };

    let isHandled = false;

    if (exception instanceof HttpException) {
      isHandled = true;
      body.statusCode = exception.getStatus();
      body.error = exception.getResponse();

      if (exception instanceof BaseError) {
        body.errorCode = exception.errorCode;
      }
    } else {
      body.error = exception.message;
    }

    if (!isHandled || this.config.enviroment !== Enviroment.production) {
      this.logger.error(exception, exception.stack);
    }
    response.status(body.statusCode).json(body);
  }
}
