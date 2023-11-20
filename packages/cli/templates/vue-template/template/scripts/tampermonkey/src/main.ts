import { createApp, installPlugins } from "@/setup";

const app = createApp();
installPlugins(app);

const oDiv = document.createElement("div");
oDiv.id = "app";
oDiv.setAttribute("class", "absolute top-0 left-0 right-0 bottom-0 bg-white z-max");
document.body.appendChild(oDiv);
app.mount("#app");
