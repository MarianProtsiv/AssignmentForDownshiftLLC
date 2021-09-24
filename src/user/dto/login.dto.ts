import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from 'src/core/interceptors/base.dto';

export class LoginDto extends BaseDTO {
  @ApiProperty({ example: 'user@mail.com', description: 'User email' })
  @IsEmail()
  @Transform((o) => o.value.toLowerCase())
  email: string;

  @ApiProperty({ example: 'ajsnHFN77m', description: 'User password' })
  @IsNotEmpty()
  password: string;
}
