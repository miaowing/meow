import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as moment from 'moment';
import { NestLogger } from '@nestcloud/logger';
import { registerPartials, registerHelper } from 'hbs';
import { NestExpressApplication } from '@nestjs/platform-express';

registerPartials(__dirname + '/views/partials');

registerHelper('dateFmt', date => {
  return moment(date).format('YYYY-MM-DD');
});

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new NestLogger({
      path: __dirname,
      filename: 'config.yaml',
    }),
  });
  app.useStaticAssets(join(__dirname, 'public'), { prefix: '/assets', maxAge: 3600000 * 356 });
  app.setBaseViewsDir(join(__dirname, 'views'));
  app.setViewEngine('hbs');
  await app.listen(3000);
}

bootstrap();
