import { App } from "vue";
import Render from "./render";
import "./index.scss";

export default function (app: App) {
  app.component("Render", Render);
}
