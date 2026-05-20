import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import { User } from '../users/models/user.model';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { UserRole } from '@/core/constants/constants';

interface JwtPayload {
  id: string;
  role: UserRole;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /* ---------- Sign Up ---------- */
  async register(payload: SignUpDto, res: Response) {
    const existing = await this.userModel.findOne({
      where: { email: payload.email },
    });
    if (existing) {
      throw new ConflictException('This email is already registered');
    }

    const hashedPass = await this.hashPass(payload.password);
    const user = await this.userModel.create({
      ...payload,
      password: hashedPass,
    });

    const tokens = await this.generateTokens({
      id: String(user.id),
      role: user.role,
    });
    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    return res.send({
      success: true,
      data: user,
      accToken: tokens.accessToken,
      refToken: tokens.refreshToken,
    });
  }

  /* ---------- Sign In ---------- */
  async login(payload: SignInDto, res: Response) {
    const user = await this.userModel.findOne({
      where: { email: payload.email },
    });
    // Bir xil xabar — email mavjudligini "leak" qilmaslik uchun
    if (!user) {
      throw new UnauthorizedException('Email yoki parol noto‘g‘ri');
    }

    const ok = await this.comparePass(payload.password, user.password);
    if (!ok) {
      throw new UnauthorizedException('Email yoki parol noto‘g‘ri');
    }

    const tokens = await this.generateTokens({
      id: String(user.id),
      role: user.role,
    });
    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    return res.send({
      success: true,
      data: user,
      accToken: tokens.accessToken,
      refToken: tokens.refreshToken,
    });
  }
  async createAccount(payload: SignUpDto) {
    const existing = await this.userModel.findOne({
      where: { email: payload.email },
    });
    if (existing) {
      throw new ConflictException(
        'Bu email allaqachon ro\u2018yxatdan o\u2018tgan',
      );
    }
    const hashedPass = await this.hashPass(payload.password);
    const user = await this.userModel.create({
      ...payload,
      password: hashedPass,
    });
    const tokens = await this.generateTokens({
      id: String(user.id),
      role: user.role,
    });
    return { user, ...tokens };
  }
  /* ---------- Refresh ---------- */
  async refresh(req: Request, res: Response) {
    const token = req.signedCookies?.['RefreshToken'];
    if (!token) {
      throw new UnauthorizedException('Refresh token topilmadi');
    }

    let decoded: JwtPayload;
    try {
      decoded = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.getOrThrow<string>(
          'REFRESH_TOKEN_SECRET_KEY',
        ),
      });
    } catch {
      throw new UnauthorizedException('Yaroqsiz yoki muddati o‘tgan token');
    }

    const tokens = await this.generateTokens({
      id: decoded.id,
      role: decoded.role,
    });
    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    return res.send({
      success: true,
      accToken: tokens.accessToken,
      refToken: tokens.refreshToken,
    });
  }

  /* ---------- Logout ---------- */
  async logout(res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('RefreshToken');
    return res.send({ success: true, message: 'Tizimdan chiqildi' });
  }

  /* ---------- Forgot password ---------- */
  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ where: { email } });

    // Xavfsizlik: email mavjud yoki yo‘qligini oshkor qilmaymiz
    if (!user) {
      return {
        success: true,
        message: 'Agar email ro‘yxatda bo‘lsa, tiklash havolasi yuborildi.',
      };
    }

    const resetToken = await this.jwtService.signAsync(
      { id: String(user.id), purpose: 'pw_reset' },
      {
        secret: this.configService.getOrThrow<string>(
          'ACCESS_TOKEN_SECRET_KEY',
        ),
        expiresIn: '15m',
      },
    );

    // TODO: bu yerda emailga yuborish kerak (nodemailer va h.k.).
    // Hozircha test uchun token qaytaramiz — productionga chiqarmasdan oldin olib tashla.
    return {
      success: true,
      message: 'Tiklash havolasi yuborildi.',
      resetToken,
    };
  }

  /* ---------- Reset password ---------- */
  async resetPassword(payload: ResetPasswordDto) {
    let decoded: { id: string; purpose?: string };
    try {
      decoded = await this.jwtService.verifyAsync(payload.token, {
        secret: this.configService.getOrThrow<string>(
          'ACCESS_TOKEN_SECRET_KEY',
        ),
      });
    } catch {
      throw new UnauthorizedException('Token muddati o‘tgan yoki yaroqsiz');
    }
    if (decoded.purpose !== 'pw_reset') {
      throw new UnauthorizedException('Yaroqsiz token');
    }

    const hashed = await this.hashPass(payload.newPassword);
    await this.userModel.update(
      { password: hashed },
      { where: { id: Number(decoded.id) } },
    );

    return { success: true, message: 'Parol yangilandi' };
  }

  /* ---------- Internal helpers ---------- */
  private async hashPass(password: string) {
    return bcrypt.hash(password, 10);
  }

  private async comparePass(originalPass: string, hashedPassword: string) {
    return bcrypt.compare(originalPass, hashedPassword);
  }

  private setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    const isProd = this.configService.get<string>('NODE_ENV') === 'production';

    res.cookie('accessToken', accessToken, {
      signed: true,
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 daqiqa
    });
    res.cookie('RefreshToken', refreshToken, {
      signed: true,
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 kun
      path: '/',
    });
  }

  private async generateTokens(payload: JwtPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>(
          'ACCESS_TOKEN_SECRET_KEY',
        ),
        expiresIn: this.configService.getOrThrow<string>(
          'ACCESS_TOKEN_EXPIRE_TIME',
        ) as JwtSignOptions['expiresIn'],
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>(
          'REFRESH_TOKEN_SECRET_KEY',
        ),
        expiresIn: this.configService.getOrThrow<string>(
          'REFRESH_TOKEN_EXPIRE_TIME',
        ) as JwtSignOptions['expiresIn'],
      }),
    ]);
    return { accessToken, refreshToken };
  }
}
