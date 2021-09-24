import { Logger, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';
import { BaseErrorFilter } from 'src/core/errors/base.error.filter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';
import { UserModule } from './user/user.module';
import { ChildModule } from './child/child.module';
import { CardModule } from './card/card.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TerminusModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.env.DB_HOST,
        port: configService.env.DB_PORT,
        username: configService.env.DB_USER,
        password: configService.env.DB_PASSWORD,
        database: configService.env.DB_NAME,
        autoLoadEntities: true
      })
    }),
    UserModule,
    ChildModule,
    CardModule,
    TransactionModule
  ],
  controllers: [AppController],
  providers: [
    Logger,
    {
      provide: APP_FILTER,
      useClass: BaseErrorFilter
    }
  ]
})
export class AppModule {}
