import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseDTO } from 'src/core/interceptors/base.dto';

export class CardDto extends BaseDTO {
  @Expose()
  @ApiProperty({ example: 1, description: 'child id' })
  @IsNotEmpty()
  childId: number;

  @Expose()
  @ApiProperty({ example: 'VISA', description: 'type' })
  @IsNotEmpty()
  type: string;

  @Expose()
  @ApiProperty({ example: '4242 4242 4242 4242', description: 'number' })
  @IsNotEmpty()
  number: string;

  @Expose()
  @ApiProperty({ example: 424, description: 'security code' })
  @IsNotEmpty()
  securityCode: string;

  @Expose()
  @ApiProperty({ example: '09-23', description: 'expire at' })
  @IsNotEmpty()
  expireAt: string;

  @Expose()
  @ApiProperty({ example: 500, description: 'monthly limit' })
  @IsNotEmpty()
  monthlyLimit: number;
}
