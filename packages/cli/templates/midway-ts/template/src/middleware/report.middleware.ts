import { IMiddleware } from '@midwayjs/core';
import { Middleware } from '@midwayjs/decorator';
import { NextFunction, Context } from '@midwayjs/koa';

@Middleware()
export class ReportMiddleware implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const startTime = Date.now();
      const result = await next();
      console.log(Date.now() - startTime);
      return result;
    };
  }

  static getName(): string {
    return 'report';
  }
}
