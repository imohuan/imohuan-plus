import { set } from "lodash";
import { FileSystemIconLoader } from "unplugin-icons/loaders";
import _Icons from "unplugin-icons/vite";
import { CSSProperties } from "vue";
//<i-<dir_name>-<page_name> /> 例子  <i-illustrations-login_flowers />
function generateIcon(dir: string, target = "src") {
  // stroke="currentColor"
  return FileSystemIconLoader(`./${target}/icons/${dir}`, (svg) =>
    svg.trim().replace(/^<svg /, '<svg fill="currentColor" ')
  );
}

export const customCollections = {
  dynamic: generateIcon("dynamic"),
  controller: generateIcon("controller"),
  illustrations: generateIcon("illustrations")
};

export function Icons(env: ViteEnv) {
  Object.keys(customCollections).forEach((key) => {
    set(customCollections, key, generateIcon(key, env.VITE_DIR));
  });

  return _Icons({
    compiler: "vue3",
    customCollections,
    iconCustomizer(collection, icon, props: CSSProperties) {
      switch (collection) {
        case "dynamic":
          props.width = "1rem";
          props.height = "1rem";
          break;
        case "controller":
          props.width = "1rem";
          props.height = "1rem";
          break;
        case "illustrations":
          props.width = "5rem";
          props.height = "5rem";
          break;
      }
    }
  });
}
