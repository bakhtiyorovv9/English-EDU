import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/models/user.model';

@Module({
    
    imports: [SequelizeModule.forFeature([User]),JwtModule.register({
      global:true
  })],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
