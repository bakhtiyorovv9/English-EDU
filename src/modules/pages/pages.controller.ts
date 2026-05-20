import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Render,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from '../auth/auth.service';

const LEVELS = [
  { id: 'A1', t: 'Beginner', q: 'Salom! Mening ismim…' },
  { id: 'A2', t: 'Elementary', q: 'Oddiy suhbat olib bora olaman' },
  { id: 'B1', t: 'Intermediate', q: 'Sayohatda muloqot qila olaman' },
  { id: 'B2', t: 'Upper-Int.', q: 'Murakkab mavzularda bahslasha olaman' },
  { id: 'C1', t: 'Advanced', q: 'Erkin va aniq fikr bildiraman' },
  { id: 'C2', t: 'Proficient', q: 'Ona tilidagidek bilaman' },
];
const GOALS = [
  {
    id: 'ielts',
    ico: '🎓',
    t: 'IELTS / Imtihon',
    d: 'Bal olish va tayyorgarlik',
  },
  { id: 'travel', ico: '✈️', t: 'Sayohat', d: 'Erkin muloqot va kundalik' },
  {
    id: 'work',
    ico: '💼',
    t: 'Ish / Karyera',
    d: 'Biznes va professional til',
  },
  {
    id: 'general',
    ico: '🌱',
    t: 'Shunchaki',
    d: 'O‘zim uchun, qiziqish bilan',
  },
];
const sel = <T extends { id: string }>(l: T[], s: string) =>
  l.map((x) => ({ ...x, selected: x.id === s }));

@Controller()
export class PagesController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @Render('welcome')
  welcome() {
    return { title: 'Boshlash — Englyx', screen: 'welcome' };
  }

  @Get('login')
  @Render('login')
  loginPage() {
    return { title: 'Kirish — Englyx', screen: 'login' };
  }

  @Post('login')
  doLogin(@Body() body: any, @Res() res: Response) {
    const name = (body?.email || 'do‘stim').split('@')[0];
    const q = new URLSearchParams({ name, level: 'B1', goal: 'ielts' });
    return res.redirect('/done?' + q.toString());
  }

  @Get('onboarding/level')
  @Render('level')
  level(@Query('level') level = 'B1') {
    return {
      title: 'Daraja — Englyx',
      screen: 'level',
      step: 2,
      total: 4,
      level,
      levels: sel(LEVELS, level),
    };
  }

  /* >>> goal_text + isOther qo'shildi <<< */
  @Get('onboarding/goal')
  @Render('goal')
  goal(
    @Query('level') level = 'B1',
    @Query('goal') goal = 'ielts',
    @Query('goal_text') goalText = '',
  ) {
    return {
      title: 'Maqsad — Englyx',
      screen: 'goal',
      step: 3,
      total: 4,
      level,
      goal,
      goals: sel(GOALS, goal),
      isOther: goal === 'other',
      goalText,
    };
  }

  /* >>> goalText qo'shildi <<< */
  @Get('onboarding/account')
  @Render('account')
  account(
    @Query('level') level = 'B1',
    @Query('goal') goal = 'ielts',
    @Query('goal_text') goalText = '',
    @Query('error') error?: string,
  ) {
    return {
      title: 'Ro‘yxat — Englyx',
      screen: 'account',
      step: 4,
      total: 4,
      level,
      goal,
      goalText,
      error,
    };
  }

  @Post('onboarding/account')
  async createAccount(@Body() body: any, @Res() res: Response) {
    try {
      const isOther = body.goal === 'other';

      const { user, accessToken, refreshToken } =
        await this.authService.createAccount({
          name: body.name,
          username: body.username,
          email: body.email,
          password: body.password,
          english_level: body.level,
          goal: isOther ? undefined : body.goal,
          goal_text: isOther ? body.goal_text || null : null,
        } as any);

      res.cookie('accessToken', accessToken, {
        signed: true,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000,
      });
      res.cookie('RefreshToken', refreshToken, {
        signed: true,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      const q = new URLSearchParams({
        name: user.name,
        level: body.level || 'B1',
        goal: body.goal || 'ielts',
        goal_text: isOther ? body.goal_text || '' : '',
      });
      return res.redirect('/done?' + q.toString());
    } catch (e: any) {
      const q = new URLSearchParams({
        level: body.level || 'B1',
        goal: body.goal || 'ielts',
        error: e?.message || 'Xatolik',
      });
      return res.redirect('/onboarding/account?' + q.toString());
    }
  }

  /* >>> goal_text qabul qiladi va custom matnni ko'rsatadi <<< */
  @Get('done')
  @Render('done')
  done(
    @Query('name') name = 'do‘stim',
    @Query('level') level = 'B1',
    @Query('goal') goal = 'ielts',
    @Query('goal_text') goalText = '',
  ) {
    const g = GOALS.find((x) => x.id === goal);
    const goalLabel =
      goal === 'other' && goalText ? goalText : g ? g.t : 'IELTS / Imtihon';
    return {
      title: 'Tayyor — Englyx',
      screen: 'done',
      firstName: String(name).split(' ')[0],
      level,
      goalLabel,
    };
  }
}
