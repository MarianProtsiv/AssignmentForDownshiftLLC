import { BaseDTO } from 'src/core/interceptors/base.dto';
import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class AppGetEnvDto extends BaseDTO {
  @Expose()
  @IsNotEmpty()
  env: string;
}
