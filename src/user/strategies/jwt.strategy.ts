import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import fs from 'fs';
import path from 'path';
import { ConfigService } from 'src/config/config.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from '../interfaces/jwt.payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('authToken')
      ]),

      // Decrypt - use public key
      secretOrKey: fs.readFileSync(
        path.join(
          path.dirname(require.main.filename),
          '..',
          configService.env.JWT_PUBLIC_KEY_PATH
        )
      ),
      ignoreExpiration: false,
      algorithms: ['ES256']
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.userService.getById(payload.id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
