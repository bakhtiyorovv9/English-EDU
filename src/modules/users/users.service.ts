import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { Level } from '../levels/models/level.model';

@Injectable()
export class UserService {
    constructor(@InjectModel(User) private readonly model: typeof User) { }
    
    async getAll() {
        const user = await this.model.findAll({include:[Level]})

        return {
            success: true,
            data:user
        }
    }
}
