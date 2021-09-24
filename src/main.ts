import {
  ClassSerializerInterceptor,
  HttpException,
  Logger,
  ValidationPipe
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from 'src/app.module';
import { ConfigService, Enviroment } from 'src/config/config.service';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { logger } from 'src/core/middlewares/logger';
import basicAuth from 'express-basic-auth';

import { ValidationError } from 'class-validator';
import { ResponseInterceptor } from './core/interceptors/response.interceptor';

async function bootstrap() {
  if (process.env.TZ !== 'UTC') {
    Logger.error('UTC time zone not set');
    process.exit(1);
  }
  if (!process.env.NODE_ENV) {
    Logger.error('NODE_ENV not set');
    process.exit(1);
  }
  process.on('uncaughtException', (err) => {
    Logger.error('Uncaught exception', err.toString());
    process.exit(1);
  });
  process.on('unhandledRejection', (reason) => {
    Logger.error('Unhandled rejection', reason.toString());
    process.exit(1);
  });

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get<ConfigService>(ConfigService);

  app.setGlobalPrefix(config.config.apiPath);
  app.use(logger.bind(null, Logger));
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        return new HttpException(
          {
            errors: errors.map((e) => ({
              value: e.value,
              property: e.property,
              constraints: e.constraints
            }))
          },
          400
        );
      }
    })
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(new Reflector()));

  if ([Enviroment.development, Enviroment.local].includes(config.enviroment)) {
    app.use(
      ['/docs', '/docs-json'],
      basicAuth({
        challenge: true,
        users: {
          [config.env.SWAGGER_USER]: config.env.SWAGGER_PASS
        }
      })
    );

    const documentConfig = new DocumentBuilder()
      .setTitle('The Test Project')
      .setDescription(
        'API docs. All responses are wrapped into "{data: response}"'
      )
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token',
          in: 'header'
        },
        'accessToken'
      )
      .build();

    app.useGlobalInterceptors(new ResponseInterceptor());
    const document = SwaggerModule.createDocument(app, documentConfig, {
      extraModels: []
    });
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(config.env.PORT, config.env.HOST);
}

bootstrap();
