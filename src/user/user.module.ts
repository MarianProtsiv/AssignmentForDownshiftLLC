import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import fs from 'fs';
import path from 'path';
import { ConfigService } from 'src/config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        signOptions: {
          algorithm: 'ES256',
          expiresIn: configService.config.jwt.expiresInSeconds
        },
        publicKey: fs.readFileSync(
          path.join(
            path.dirname(require.main.filename),
            '..',
            configService.env.JWT_PUBLIC_KEY_PATH
          )
        ),
        privateKey: fs.readFileSync(
          path.join(
            path.dirname(require.main.filename),
            '..',
            configService.env.JWT_PRIVATE_KEY_PATH
          )
        )
      })
    })
  ],

  controllers: [UserController],
  providers: [UserService, LocalStrategy, JwtStrategy]
})
export class UserModule {}
