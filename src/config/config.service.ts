import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import fs from 'fs';
import { ConfigModuleOptions } from 'src/config/config.module';
import { ConfigT } from 'src/config/templates/config.template';
import { EnvT } from 'src/config/templates/env.template';

export const CONFIG_OPTIONS = 'CONFIG_OPTIONS';
export enum Enviroment {
  local = 'local',
  test = 'test',
  development = 'development',
  staging = 'staging',
  production = 'production'
}

@Injectable()
export class ConfigService {
  private e: EnvT;
  private c: ConfigT;

  constructor(@Inject('CONFIG_OPTIONS') options: ConfigModuleOptions) {
    const envFile = fs.readFileSync(options.envPath).toString();
    const envObj = {};
    envFile.split('\n').forEach((line) => {
      if (!line) return;

      const [key, value] = line.split('=').map((p) => p.trim());
      envObj[key] = value;
    });
    const env = plainToClass(EnvT, envObj);
    this.validate(env);
    this.e = env;

    const configObj = JSON.parse(
      fs.readFileSync(options.configPath).toString()
    );
    const config = plainToClass(ConfigT, configObj);
    this.validate(config);
    this.c = config;
  }

  get env(): EnvT {
    return this.e;
  }

  get config(): ConfigT {
    return this.c;
  }

  get enviroment(): Enviroment {
    return process.env.NODE_ENV as Enviroment;
  }

  private validate(obj: Record<string, any>): void {
    const errors = validateSync(obj, {
      forbidNonWhitelisted: true
    });
    if (errors.length > 0) {
      throw new Error(JSON.stringify(errors[0], null, 2));
    }
  }
}
