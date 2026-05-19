import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import { AppModule } from './app.module';

import hbs = require('hbs');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser(process.env.COOKIE_SECRET));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidUnknownValues: true,
    }),
  );

  const viewsDir = join(__dirname, '..', 'views');

  app.useStaticAssets(join(__dirname, '..', 'public'), { prefix: '/' });

  app.setBaseViewsDir(viewsDir);
  app.setViewEngine('hbs');

  hbs.registerPartials(join(viewsDir, 'partials'));
  hbs.registerHelper('year', () => new Date().getFullYear());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Englyx → http://localhost:${port}`);
}
bootstrap();
