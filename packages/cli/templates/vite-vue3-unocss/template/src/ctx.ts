import { Plugin } from "vue";

export class Ctx {
  constructor() {
    window.ctx = 1;
  }

  print(...args: any[]) {
    console.log(...args);
  }
}

export const createCtx = (): Plugin => {
  return {
    install: (app, options) => {
      app.config.globalProperties.$ctx = new Ctx();
    },
  };
};

const a = createCtx();
