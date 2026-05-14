import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { Level } from '../levels/models/level.model';

@Module({
  imports: [SequelizeModule.forFeature([User,Level])],
  controllers: [UsersController],
  providers:[UserService]
})
export class UsersModule {}
