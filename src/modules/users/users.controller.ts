import { Controller, Get } from '@nestjs/common';
import { UserService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly service: UserService) { }
    
    @Get()
    async getAll() {
        return await this.service.getAll()
    }
}
