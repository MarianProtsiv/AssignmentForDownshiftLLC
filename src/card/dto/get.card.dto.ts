import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Child } from 'src/child/entities/child.entity';

export class GetCardDto {
  @Expose()
  @ApiProperty({ example: 1, description: 'number' })
  @IsNotEmpty()
  id: number;

  @Expose()
  @ApiProperty({ example: 1, description: 'child id' })
  @IsNotEmpty()
  childId: Child;

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
  securityCode: number;

  @Expose()
  @ApiProperty({ example: 424, description: 'expire at' })
  @IsNotEmpty()
  expireAt: Date;

  @Expose()
  @ApiProperty({ example: 500, description: 'monthly limit' })
  @IsNotEmpty()
  monthlyLimit: number;
}
