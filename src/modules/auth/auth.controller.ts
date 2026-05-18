import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import type { Response } from 'express';

@Controller("auth")
export class AuthController {
    constructor(private readonly service: AuthService) { }
    
    @Post("/sign-up")
    async signUp(@Body() payload: SignUpDto, @Res() res: Response) {
        return this.service.register(payload,res)
    }
}
