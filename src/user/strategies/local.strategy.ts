import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      session: false
    });
  }

  async validate(email: string, password: string): Promise<User> {
    const user = await this.userService.getByEmail(email);
    if (!user || !(await user.isPasswordValid(password))) {
      throw new BadRequestException();
    }
    return user;
  }
}
