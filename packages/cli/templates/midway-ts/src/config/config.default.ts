import { MidwayConfig } from '@midwayjs/core';

export default {
  keys: '1646709282905_3321',
  koa: {
    port: 7001,
  },
  webSocket: { port: 3000 },
  jwt: {
    secret: 'imohuan_jwtcode',
    expiresIn: '2d', // https://github.com/vercel/ms
  },
  passport: {
    session: false, // 由于 passport 默认会尝试将 user 数据写入session，如果无需将用户保存到 session，可以将 session 支持关闭。
  },
  staticFile: {
    dirs: {
      default: { prefix: '/', dir: 'public' },
    },
  },
  cors: {
    credentials: false,
  },
  jsonp: {
    callback: 'jsonp',
    limit: 512,
  },
  midwayLogger: {
    default: {
      maxSize: '100m',
      maxFiles: '3d',
      datePattern: 'YYYY-MM-DD.log',
      format: info => {
        return `${info.timestamp} ${info.LEVEL} ${info.pid} ${info.labelText}${info.message}`;
      },
    },
    clients: {
      coreLogger: {
        fileLogName: 'core',
      },
      appLogger: {
        fileLogName: 'app',
      },
    },
  },
} as MidwayConfig;
