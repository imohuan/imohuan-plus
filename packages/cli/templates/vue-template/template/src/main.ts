import { installPlugins, createApp } from "./setup";

const app = createApp();
installPlugins(app);
app.mount("#app");
