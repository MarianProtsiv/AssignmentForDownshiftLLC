import { IsNumberString, IsString } from 'class-validator';

export class EnvT {
  @IsNumberString()
  PORT: string;
  @IsString()
  HOST: string;
  @IsNumberString()
  DB_PORT: number;
  @IsString()
  DB_HOST: string;
  @IsString()
  DB_USER: string;
  @IsString()
  DB_NAME: string;
  @IsString()
  DB_PASSWORD: string;
  @IsString()
  JWT_PUBLIC_KEY_PATH: string;
  @IsString()
  JWT_PRIVATE_KEY_PATH: string;
  @IsString()
  SWAGGER_USER: string;
  @IsString()
  SWAGGER_PASS: string;
}
