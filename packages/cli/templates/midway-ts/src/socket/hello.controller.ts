import {
  Inject,
  WSController,
  OnWSConnection,
  WSBroadCast,
  OnWSMessage,
  OnWSDisConnection,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/ws';
import { IncomingMessage } from 'http';

@WSController()
export class HelloSocketController {
  @Inject()
  ctx: Context;

  @OnWSConnection() // 连接成功执行方法
  async onConnectionMethod(socket: Context, request: IncomingMessage) {
    console.log(
      `连接成功,  namespace / got a connection  ${this.ctx.readyState}`
    );
    // console.log(socket, request);
  }

  @WSBroadCast() // 向所有连接的客户端发送消息
  @OnWSMessage('message')
  async gotMessage(data) {
    const send = {
      a: 1,
      b: 2,
      c: [12, 23, 2, 3, 123123, 12, 312, 3],
      msg: data.toString(),
    };
    return { name: 'harry', result: send };
  }

  @OnWSDisConnection() // 在客户端断连时，做一些额外处理
  async disconnect(id: number) {
    console.log('disconnect ' + id);
  }
}
