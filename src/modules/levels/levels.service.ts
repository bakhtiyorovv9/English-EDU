import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Level } from './models/level.model';

@Injectable()
export class LevelService {
  constructor(@InjectModel(Level) private readonly model: typeof Level) {}

  async getAll() {
    const levels = await this.model.findAll();

    return {
      success: true,
      data: levels,
    };
  }
}
