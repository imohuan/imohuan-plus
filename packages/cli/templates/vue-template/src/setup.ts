import "uno.css";
import "./styles/global.css";
import "./styles/theme.css";
import "@unocss/reset/tailwind.css";
import "@quasar/extras/material-icons/material-icons.css";
import "quasar/src/css/index.sass";
import "element-plus/dist/index.css";
import "@/helper/log";

import ElementPlus from "element-plus";
import { createPinia } from "pinia";
import { Dialog, Notify, Quasar } from "quasar";
import { App, createApp as _createApp } from "vue";

import ImApp from "@/App.vue";
import { createHead } from "@vueuse/head"; // <--

import { router } from "./router";

export function installPlugins(app: App) {
  app.use(router);
  app.use(createHead());
  app.use(createPinia());
  app.use(Quasar, { plugins: { Dialog, Notify } });
  app.use(ElementPlus);
}

export function createApp() {
  return _createApp(ImApp);
}
