import { Module } from '@nestjs/common';
import { LevelService } from './levels.service';
import { LevelsController } from './levels.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Level } from './models/level.model';

@Module({
  imports: [SequelizeModule.forFeature([Level])],
  providers: [LevelService],
  controllers: [LevelsController],
})
export class LevelsModule {}
