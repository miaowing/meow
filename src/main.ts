import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join, resolve } from 'path';
import * as moment from 'moment';
import { Logger, NestLogger } from '@nestcloud/logger';
import { registerPartials, registerHelper } from 'hbs';

Logger.contextPath = resolve(__dirname, 'configs');
Logger.filename = 'config.yaml';

registerPartials(__dirname + '/views/partials');

registerHelper('dateFmt', date => {
  return moment(date).format('YYYY-MM-DD');
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: new NestLogger() });
  app.useStaticAssets(join(__dirname, 'public'), { prefix: '/assets', maxAge: 3600000 * 356 });
  app.setBaseViewsDir(join(__dirname, 'views'));
  app.setViewEngine('hbs');
  await app.listen(4000);
}

bootstrap();
