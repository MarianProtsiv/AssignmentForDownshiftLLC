import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@mail.com', description: 'User email' })
  @IsEmail()
  @Transform((o) => o.value.toLowerCase())
  email: string;

  @ApiProperty({ example: 'ajsnHFN77m', description: 'User password' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'first Name', description: 'Special first name' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'last Name', description: 'Special last name' })
  @IsNotEmpty()
  lastName: string;
}
