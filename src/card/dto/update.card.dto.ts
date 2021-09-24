import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseDTO } from 'src/core/interceptors/base.dto';

export class UpdateCardDto extends BaseDTO {
  @Expose()
  @ApiProperty({ example: 500, description: 'monthly limit' })
  @IsNotEmpty()
  monthlyLimit: number;
}
