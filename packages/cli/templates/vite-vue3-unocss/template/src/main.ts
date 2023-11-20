import { createApp } from "vue";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";

import "uno.css";
import "./styles/reset.css";
import "./styles/global.scss";
import "@unocss/reset/normalize.css";
import { createCtx } from "./ctx";
// import 'virtual:unocss-devtools'
// import "@unocss/reset/tailwind.css";

const router = createRouter({
  routes: [{ path: "/", component: () => import("@/pages/page1.vue") }],
  history: createWebHistory(),
});

const app = createApp(App);
app.use(router);
app.use(createCtx());
app.use(createPinia());
app.mount("#app");
