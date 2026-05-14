import { Controller, Get } from "@nestjs/common";
import { LevelService } from "./levels.service";

@Controller("levels")
export class LevelsController {
    constructor(private readonly service: LevelService) {
        
    }

    @Get()
    async getAll() {
        return await this.service.getAll()
    }
}