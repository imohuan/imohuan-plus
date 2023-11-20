import { Controller, Get, Inject } from '@midwayjs/decorator';
import { ILogger } from '@midwayjs/logger';

@Controller('/')
export class HomeController {
  @Inject()
  logger: ILogger;

  @Get('/')
  async home(): Promise<string> {
    this.logger.info('heshlfklksd');
    return 'Hello Midwayjs!';
  }

  @Get('/test')
  async test(): Promise<string> {
    return 'test1';
  }
}
