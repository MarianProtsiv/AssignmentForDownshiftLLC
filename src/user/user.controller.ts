import { Controller, Post, Body, HttpCode, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { plainToClass } from 'class-transformer';
import { TokenDto } from './dto/token.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/user';
import { User } from './entities/user.entity';
import { SwaggerRouteDecorator } from 'src/core/decorators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @SwaggerRouteDecorator({
    apiOperationData: { summary: 'Registration of user' },
    apiResponseData: { status: 200, type: TokenDto },
    apiBodyData: { type: RegisterDto }
  })
  @HttpCode(200)
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<TokenDto> {
    const accessToken = await this.userService.register(registerDto);
    return plainToClass(TokenDto, { accessToken });
  }

  @SwaggerRouteDecorator({
    apiOperationData: { summary: 'Logging to the system' },
    apiResponseData: { status: 200, type: TokenDto },
    apiBodyData: { type: TokenDto }
  })
  @HttpCode(200)
  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@GetUser() user: User): Promise<TokenDto> {
    const accessToken = await this.userService.login(user);
    return plainToClass(TokenDto, { accessToken });
  }
}
