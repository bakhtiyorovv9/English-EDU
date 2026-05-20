import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import type { Request, Response } from 'express';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('/sign-up')
  async signUp(@Body() payload: SignUpDto, @Res() res: Response) {
    return this.service.register(payload, res);
  }

  @Post('/sign-in')
  async signIn(@Body() payload: SignInDto, @Res() res: Response) {
    return this.service.login(payload, res);
  }

  @Post('/refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    return this.service.refresh(req, res);
  }

  @Post('/logout')
  async logout(@Res() res: Response) {
    return this.service.logout(res);
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() payload: ForgotPasswordDto) {
    return this.service.forgotPassword(payload.email);
  }

  @Post('/reset-password')
  async resetPassword(@Body() payload: ResetPasswordDto) {
    return this.service.resetPassword(payload);
  }
}
