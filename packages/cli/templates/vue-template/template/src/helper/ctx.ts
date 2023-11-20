import ColorTool from "color";
import moment from "moment";
import "moment/dist/locale/zh-cn";

import { defaultsDeep, isString, set } from "lodash-es";
import { copyToClipboard, Notify, QNotifyCreateOptions, uid } from "quasar";

class Theme {
  id: string;
  defaultColor: Color;

  constructor(id: string) {
    this.id = id;
    this.defaultColor = {
      primary: "rgb(97, 158, 104)",
      secondary: "rgb(38, 166, 154)",
      accent: "rgb(156, 39, 176)",
      dark: "rgb(29, 29, 29)",
      positive: "rgb(33, 186, 69)",
      negative: "rgb(193, 0, 21)",
      info: "rgb(49, 204, 236)",
      warning: "rgb(242, 192, 55)"
    } as Color;
  }

  getDom() {
    let dom = document.getElementById(this.id);
    if (!dom) {
      dom = document.createElement("style");
      dom.id = this.id;
      document.head.appendChild(dom);
    }
    return dom;
  }

  set(color: Partial<Color> = {}) {
    color = defaultsDeep({}, color, this.get(), this.defaultColor);
    const dom = this.getDom();
    const vars = Object.keys(color).map((key) => {
      const value = ColorTool(color[key]).rgb().string();
      return `  --${key}: ${value.slice(0, -1)}, var(--un-bg-opacity));`;
    });
    const txt = `*, ::before, ::after { \n  --un-bg-opacity: 1; \n${vars.join("\n")}\n}`;
    dom.innerHTML = txt;
    ctx.store.set("theme", color);
  }

  get(): Color {
    const storeColor = ctx.store.get("theme");
    if (storeColor) return defaultsDeep(storeColor, this.defaultColor);
    const dom = this.getDom();
    const html = dom.innerHTML;
    const regexp = /--([a-z\-]+):\s(rgb\([-0-9a-z,\s\(\)]+\))/g;
    const color: Partial<Color> = {};
    let value: any = null;
    while ((value = regexp.exec(html))) {
      const [_, name, val] = value;
      set(color, name, val);
    }
    return defaultsDeep(color, this.defaultColor);
  }
}

class Store {
  get(name: string, defaults: string = "") {
    let result = localStorage.getItem(name);
    result = !result || !String(result).trim() ? defaults : result;
    try {
      return JSON.parse(result);
    } catch {
      return result;
    }
  }

  set(name: string, data: any) {
    localStorage.setItem(name, isString(data) ? data : JSON.stringify(data));
  }

  delete(name: string) {
    localStorage.removeItem(name);
  }
}

class Ctx {
  store: Store;
  theme: Theme;

  static instance: Ctx;
  static getInstance() {
    if (!Ctx.instance) Ctx.instance = new Ctx();
    return Ctx.instance;
  }

  constructor() {
    this.store = new Store();
    this.theme = new Theme("theme-color");
  }

  moment() {
    return moment;
  }

  uid() {
    return uid();
  }

  async copy(value: any): Promise<void> {
    return copyToClipboard(value);
  }

  notify(
    type: "positive" | "negative" | "warning" | "info" | "ongoing",
    message: string,
    option: Omit<QNotifyCreateOptions, "type" | "message" | "color"> & { color?: ColorKeys } = {}
  ) {
    const ops = defaultsDeep(option, {
      type,
      message,
      position: "bottom-right",
      progress: true,
      classes: "glossy",
      timeout: 1000
    } as QNotifyCreateOptions);
    Notify.create(ops);
  }
}

export const ctx = Ctx.getInstance();
