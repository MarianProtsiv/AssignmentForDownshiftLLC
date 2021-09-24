import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator
} from '@nestjs/terminus';
import { CustomInterceptorIgnore } from 'src/core/decorators';
import { plainToClass } from 'class-transformer';
import { AppGetEnvDto } from 'src/core/dto/app.get.env.dto';

@Controller('app')
export class AppController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator
  ) {}

  @Get('env')
  getEnv(): AppGetEnvDto {
    return plainToClass(AppGetEnvDto, { env: process.env.NODE_ENV });
  }

  @CustomInterceptorIgnore()
  @Get('health')
  @HealthCheck()
  getHealth() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }
}
