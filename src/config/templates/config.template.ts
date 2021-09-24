import { IsInt, IsString, ValidateNested } from 'class-validator';

class Jwt {
  @IsInt()
  expiresInSeconds: number;
}

export class ConfigT {
  @IsString()
  apiPath: string;
  @ValidateNested()
  jwt: Jwt;
}
