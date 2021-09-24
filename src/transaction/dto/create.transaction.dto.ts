import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreateTransactionDto {
  @Expose()
  @ApiProperty({ example: 1, description: 'child id' })
  @IsNotEmpty()
  childId: number;

  @Expose()
  @ApiProperty({ example: '4242424242424242', description: 'card number' })
  @IsNotEmpty()
  number: string;

  @Expose()
  @ApiProperty({ example: 150, description: 'amount' })
  @IsNotEmpty()
  amount: number;
}
