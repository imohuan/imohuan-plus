import { createApp } from "vue";
import App from "./App.vue";
// import * as Components from "@imohuan-plus/components";

const app = createApp(App);
// Object.values(Components).forEach((value) => app.use(value));
app.mount("#app");
