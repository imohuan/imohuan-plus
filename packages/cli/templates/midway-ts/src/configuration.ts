import { join } from 'path';
import * as ws from '@midwayjs/ws';
import * as jwt from '@midwayjs/jwt';
import * as koa from '@midwayjs/koa';
import * as info from '@midwayjs/info';
import * as passport from '@midwayjs/passport';
import * as validate from '@midwayjs/validate';
import * as staticFile from '@midwayjs/static-file';
import * as crossDomain from '@midwayjs/cross-domain';

import { DefaultErrorFilter } from './filter/default.filter';
import { NotFoundFilter } from './filter/notfound.filter';

import { ReportMiddleware } from './middleware/report.middleware';
import { Configuration, App } from '@midwayjs/decorator';

@Configuration({
  imports: [
    koa,
    ws,
    jwt,
    passport,
    validate,
    staticFile,
    crossDomain,
    { component: info, enabledEnvironment: ['local'] },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application;

  async onReady() {
    // add middleware
    this.app.getMiddleware().insertFirst(ReportMiddleware);
    // add filter
    this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
  }
}
