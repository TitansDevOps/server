import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import {
  POSTGRES,
  LOCALHOST_ENV,
  DATABASE_OPTIONS,
} from '@modules/admin/constants';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './modules/auth/constants/jwt.constant';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './modules/auth/guard/roles.guard';
import { AuthGuard } from './modules/auth/guard/auth.guard';
import { MailModule } from './modules/mail/mail.module';
import { FileModule } from '@modules/file/file.module';

import { AppController } from '@modules/admin/app.controller';

config();

@Module({
  imports: [
    process.env.NODE_ENV != LOCALHOST_ENV
      ? TypeOrmModule.forRoot({
          type: POSTGRES,
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT, 10),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          autoLoadEntities: true,
          synchronize: true,
          ssl:
            process.env.DB_SSL === 'true'
              ? { rejectUnauthorized: false }
              : false,
        })
      : TypeOrmModule.forRoot({
          type: POSTGRES,
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT, 10),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          autoLoadEntities: true,
          synchronize: true,
        }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: jwtConstants.expiresIn,
      },
    }),
    AuthModule,
    UsersModule,
    MailModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
