import { Ctx } from "@/ctx";

declare global {
  const ctx: number;
  interface Window {
    ctx: number;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    // Vue组件Component的声明 配合 自定义插件或者 app.config.globalProperties
    $ctx: Ctx;
  }
}

export {};
