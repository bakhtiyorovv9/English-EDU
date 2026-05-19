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

  @Get('onboarding/goal')
  @Render('goal')
  goal(@Query('level') level = 'B1', @Query('goal') goal = 'ielts') {
    return {
      title: 'Maqsad — Englyx',
      screen: 'goal',
      step: 3,
      total: 4,
      level,
      goal,
      goals: sel(GOALS, goal),
    };
  }

  @Get('onboarding/account')
  @Render('account')
  account(@Query('level') level = 'B1', @Query('goal') goal = 'ielts') {
    return {
      title: 'Ro‘yxat — Englyx',
      screen: 'account',
      step: 4,
      total: 4,
      level,
      goal,
    };
  }

  @Post('onboarding/account')
  createAccount(@Body() body: any, @Res() res: Response) {
    const q = new URLSearchParams({
      name: body?.name || 'do‘stim',
      level: body?.level || 'B1',
      goal: body?.goal || 'ielts',
    });
    return res.redirect('/done?' + q.toString());
  }

  @Get('done')
  @Render('done')
  done(
    @Query('name') name = 'do‘stim',
    @Query('level') level = 'B1',
    @Query('goal') goal = 'ielts',
  ) {
    const g = GOALS.find((x) => x.id === goal);
    return {
      title: 'Tayyor — Englyx',
      screen: 'done',
      firstName: String(name).split(' ')[0],
      level,
      goalLabel: g ? g.t : 'IELTS / Imtihon',
    };
  }
}
