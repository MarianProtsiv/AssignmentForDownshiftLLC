import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from 'src/app.controller';
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { plainToClass } from 'class-transformer';
import { AppGetEnvDto } from 'src/core/dto/app.get.env.dto';

describe('AppController', () => {
  let appController: AppController;
  const mockHealthCheckService = {};
  const mockTypeOrmHealthIndicator = {};
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [HealthCheckService, TypeOrmHealthIndicator]
    })
      .overrideProvider(HealthCheckService)
      .useValue(mockHealthCheckService)
      .overrideProvider(TypeOrmHealthIndicator)
      .useValue(mockTypeOrmHealthIndicator)
      .compile();

    appController = app.get<AppController>(AppController);
  });

  describe('env', () => {
    it(`should return {env: "${process.env.NODE_ENV}"}`, () => {
      expect(appController.getEnv()).toStrictEqual(
        plainToClass(AppGetEnvDto, { env: process.env.NODE_ENV })
      );
    });
  });
});
