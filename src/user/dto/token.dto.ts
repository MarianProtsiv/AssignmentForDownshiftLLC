import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from 'src/core/interceptors/base.dto';

export class TokenDto extends BaseDTO {
  @ApiProperty({
    example:
      'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNjIzMTQyOTE...',
    description: 'User token'
  })
  @IsNotEmpty()
  accessToken: string;
}
