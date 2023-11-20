import { createStyleImportPlugin, ElementPlusResolve } from "vite-plugin-style-import";

export function Styles(env: ViteEnv) {
  return createStyleImportPlugin({
    resolves: [ElementPlusResolve()],
    libs: [
      // 如果您没有所需的解决方案，可以直接在库中编写，或者可以向我们提供PR
      // {
      //   libraryName: "vxe-table",
      //   esModule: true,
      //   ensureStyleFile: true,
      //   resolveComponent: (name) => `vxe-table/es/${name}`,
      //   resolveStyle: (name) => `vxe-table/es/${name}/style.css`
      // }
    ]
  });
}
