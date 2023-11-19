import chalk from "chalk";
import { PluginOption } from "vite";

export function Custom(): PluginOption {
  let config: any = {};
  return {
    name: "custom-plugins",
    apply: "serve",
    configResolved(_config) {
      config = _config;
    },
    configureServer(server) {
      server.httpServer?.once("listening", () => {
        const protocol = config.server.https ? "https" : "http";
        const port = config.server.port;
        setTimeout(() => {
          console.log(`  > Unocss:  ${chalk.yellow(`${protocol}://localhost:${port}/__unocss/`)}`);
        }, 0);
      });
    }
  };
}
