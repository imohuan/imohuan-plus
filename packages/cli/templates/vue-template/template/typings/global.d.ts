import type { App, CSSProperties, PropType as VuePropType } from "vue";

type Log = (...args: any) => void;

declare global {
  type CSSAttr = CSSProperties;

  const __APP_INFO__: {
    pkg: {
      name: string;
      version: string;
      dependencies: Recordable<string>;
      devDependencies: Recordable<string>;
    };
    lastBuildTime: string;
  };

  const echo: {
    log: Log;
    warn: Log;
    error: Log;
    track: Log;
    group: Log;
    groupEnd: Log;
    asAlert: (args: any) => any;
    asWarning: (args: any) => any;
  };

  const println: Log;

  interface ViteEnv {
    /** 项目本地运行端口号 */
    VITE_PORT: string;
    /** 开发环境读取配置文件路径 */
    VITE_PUBLIC_PATH: string;
    /** 开发环境代理 */
    VITE_PROXY_DOMAIN: string;
    /** 开发环境后端地址 */
    VITE_PROXY_DOMAIN_REAL: string;
    /** 开发环境路由历史模式 */
    VITE_ROUTER_HISTORY: string;
    /** 是否为打包后的文件提供传统浏览器兼容性支持 支持 true 不支持 false */
    VITE_LEGACY: "true" | "false";
    /** Src目录地址 */
    VITE_DIR: string;
  }

  interface Color {
    primary: string;
    secondary: string;
    accent: string;
    dark: string;
    positive: string;
    negative: string;
    info: string;
    warning: string;
  }

  type ColorKeys = keyof Color;
  type SizeKeys = "xs" | "sm" | "md" | "lg" | "xl";

  interface Eslint {
    config: {
      env: { browser: boolean; [key: string]: any };
      parserOptions: any;
      rules: any;
    };
    esLinter: {
      version: string;
      getRules: () => any[];
      verify: (code: string, config: any) => any;
    };
    rules: any;
  }

  interface Window {
    // Global vue app instance
    linter: Eslint;
    MonacoEnvironment: any;
    __APP__: App<Element>;
    webkitCancelAnimationFrame: (handle: number) => void;
    mozCancelAnimationFrame: (handle: number) => void;
    oCancelAnimationFrame: (handle: number) => void;
    msCancelAnimationFrame: (handle: number) => void;
    webkitRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    mozRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    oRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    msRequestAnimationFrame: (callback: FrameRequestCallback) => number;
  }

  // vue
  type PropType<T> = VuePropType<T>;

  type Writable<T> = {
    -readonly [P in keyof T]: T[P];
  };

  type Nullable<T> = T | null;
  type Recordable<T = any> = Record<string, T>;
  type ReadonlyRecordable<T = any> = {
    readonly [key: string]: T;
  };
  type Indexable<T = any> = {
    [key: string]: T;
  };
  type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
  };
  type TimeoutHandle = ReturnType<typeof setTimeout>;
  type IntervalHandle = ReturnType<typeof setInterval>;

  interface ChangeEvent extends Event {
    target: HTMLInputElement;
  }

  interface WheelEvent {
    path?: EventTarget[];
  }

  interface ImportMetaEnv extends ViteEnv {
    __: unknown;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  function parseInt(s: string | number, radix?: number): number;

  function parseFloat(string: string | number): number;
}

export {};
