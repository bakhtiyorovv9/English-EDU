import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/models/user.model';
import { SignUpDto } from './dtos/sign-up.dto';
import bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@/core/constants/constants';
import { JwtSignOptions } from '@nestjs/jwt';
import type {Response} from'express'

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

  async login() {}

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


    const { accessToken, refreshToken } = await this.generateTokens({
      id: String(user.id),
      role: user.role,
    });

    res.cookie("accessToken", accessToken, {
      signed: true,
    })
    res.cookie('RefreshToken', refreshToken, {
      signed:true
    });

    res.send({
      success: true,
      data: user,
      accToken: accessToken,
      refToken: refreshToken,
    });
  }

  async refresh() {}

  async forgotPassword() {}

  async resetPassword() {}

  private async hashPass(password: string) {
    const hashed = await bcrypt.hash(password, 10);
    return hashed;
  }

  private async comparePass(originalPass: string, hashedPassword: string) {
    const isSame = await bcrypt.compare(originalPass, hashedPassword);
    return isSame;
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
