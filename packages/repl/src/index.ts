import { existsSync, readFileSync, statSync } from "fs-extra";
import glob from "glob";
import { defaultsDeep, get, isArray } from "lodash-es";
import { basename, dirname as _dirname, resolve } from "path";

import { compileModulesForPreview } from "./moduleCompiler";
import { ReplStore } from "./store";

interface VueParseOption {
  template: string;
  exclude: string | string[];
  include: string | string[];
  cssList: string[];
  importMap: { [key: string]: string };
}

export class VueParse {
  private main: string;
  private dirname: string;
  private store: ReplStore;
  private option: VueParseOption;
  private files: string[] = [];

  constructor(dirname: string, userOption: Partial<VueParseOption> = {}) {
    this.store = new ReplStore();
    this.dirname = resolve(dirname);
    if (!existsSync(this.dirname)) {
      throw new Error("目标地址不存在");
    }

    if (statSync(this.dirname).isDirectory()) {
      this.main = "App.vue";
    } else {
      this.main = basename(this.dirname);
      this.dirname = _dirname(this.dirname);
    }

    this.option = defaultsDeep(userOption, {
      template: `
<!DOCTYPE html>
<html>
  <head>
    <!-- VUE_CSS_INJECT -->
    <style id="__sfc-styles"></style>
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- ES Module Shims: Import maps polyfill for modules browsers without import maps support (all except Chrome 89+) -->
    <script async src="https://unpkg.com/es-module-shims@0.10.1/dist/es-module-shims.min.js"></script>
    <script type="importmap">
      <!--IMPORT_MAP-->
    </script>
    <!-- VUE_SCRIPT_INJECT -->
  </head>
  <body></body>
</html>
`,
      importMap: {},
      include: [],
      exclude: [],
      cssList: []
    } as VueParseOption);
    this.init();
  }

  private init() {
    const files = new Set(
      this.getFile(
        ["**/*.vue", "**/*.ts", "**/*.css", "**/*.scss", ...this.option.include],
        this.dirname
      )
    );
    this.getFile(this.option.exclude, this.dirname).forEach((f) => files.delete(f));
    this.files = Array.from(files);
  }

  getFile(wildcards: string | string[], cwd: string): string[] {
    wildcards = isArray(wildcards) ? wildcards : [wildcards];
    const result: string[] = wildcards.reduce((pre, cur) => {
      return pre.concat(glob.sync(cur, { cwd: cwd }).map((m) => resolve(cwd, m)));
    }, [] as string[]);
    return result;
  }

  public setMain(name: string) {
    this.main = name;
  }

  private async module(): Promise<string[]> {
    const files: string[] = this.files;
    const newImportMap: any = {};
    const newFiles: Record<string, any> = {};

    files.forEach((filepath) => {
      const name = filepath.replace(this.dirname + "\\", "").replace(/\\/g, "/");
      const code = readFileSync(filepath).toString();
      newFiles[name] = code;
      newImportMap[name] = filepath;
    });

    const app = get(newFiles, this.main, false);
    if (!app) return [];
    const importMapJson: any = JSON.parse(this.store.getFiles()["import-map.json"]);
    Object.keys(newFiles).forEach((f) => {
      if (f === this.main) return;
      importMapJson.imports[f] = newImportMap[f];
    });

    await this.store.setFiles(newFiles, this.main);
    this.store.setImportMap(importMapJson);

    return compileModulesForPreview(this.store);
  }

  public async generate(): Promise<string[]> {
    try {
      const modules = await this.module();

      const codeToEval = [
        `window.__modules__ = {};window.__css__ = '';` +
          `if (window.__app__) window.__app__.unmount();` +
          `document.body.innerHTML = '<div id="app"></div>'`,
        ...modules,
        `document.getElementById('__sfc-styles').innerHTML = window.__css__`
      ];

      const mainFile = this.store.state.mainFile;
      if (mainFile.endsWith(".vue")) {
        codeToEval.push(
          `import { createApp as _createApp } from "vue"
          const AppComponent = __modules__["${mainFile}"].default
          AppComponent.name = 'Repl'
          const app = window.__app__ = _createApp(AppComponent)
          app.config.unwrapInjectedRef = true
          app.config.errorHandler = e => console.error(e)
          app.mount('#app')
          `.trim()
        );
      }
      return codeToEval;
    } catch (e: any) {
      return [];
    }
  }

  public async html() {
    const moduleScripts = await this.generate();
    const vueModules = moduleScripts
      .map((m) => `<script type="module">\n${m}\n</script>`)
      .join("\n");

    const importMap = this.store.getImportMap();
    if (!importMap.imports) importMap.imports = {};
    if (!importMap.imports.vue) importMap.imports.vue = this.store.state.vueRuntimeURL;

    const html = this.option.template
      .replace(/<!-- VUE_SCRIPT_INJECT -->/, vueModules)
      .replace(
        /<!--IMPORT_MAP-->/,
        JSON.stringify(defaultsDeep({ imports: { ...this.option.importMap } }, importMap))
      )
      .replace(
        /<!-- VUE_CSS_INJECT -->/,
        this.option.cssList
          .map((path) => `<link href="${path}" rel="stylesheet" type="text/css" />`)
          .join("\n")
      );

    return html;
  }
}
