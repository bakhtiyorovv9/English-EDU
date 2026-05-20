import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from '@/core/config/env.validation';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './modules/users/users.module';
import { LevelsModule } from './modules/levels/levels.module';
import { AuthModule } from './modules/auth/auth.module';
import { PagesModule } from './modules/pages/pages.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validate,
    }),
    SequelizeModule.forRoot({
      uri: process.env.DATABASE_URL,
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      logging: console.log,
      synchronize: true,
      sync: {
        alter: true,
        force: process.env.NODE_ENV === `development`,
      },
      autoLoadModels: true,
    }),
    PagesModule,
    AuthModule,
    UsersModule,
    LevelsModule,
  ],
})
export class AppModule {}
