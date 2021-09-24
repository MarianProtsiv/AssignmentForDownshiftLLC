import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ChildDto {
  @Expose()
  @ApiProperty({ example: 15, description: 'age' })
  @IsNotEmpty()
  age: number;

  @Expose()
  @ApiProperty({ example: 'first Name', description: 'Special first name' })
  @IsNotEmpty()
  firstName: string;

  @Expose()
  @ApiProperty({ example: 'last Name', description: 'Special last name' })
  @IsNotEmpty()
  lastName: string;
}
