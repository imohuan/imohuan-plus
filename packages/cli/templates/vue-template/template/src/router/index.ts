import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from "vue-router";

import LayoutDefault from "@/layouts/default/index.vue";
import LayoutFull from "@/layouts/full/index.vue";
import { LayoutNav, RouteRaw } from "@/typings";

export const baseRoutes: RouteRaw[] = [
  {
    path: "",
    meta: { icon: "home", title: "主页", layout: LayoutDefault },
    alias: ["/"],
    components: { default: () => import("@/views/home/index.vue") }
  },
  {
    path: "404",
    meta: { icon: "home", title: "404", layout: LayoutFull },
    alias: ["/:pathMatch(.*)*", "/404"],
    components: { default: () => import("@/views/404/index.vue") }
  },
  {
    path: "404-noCache",
    meta: { icon: "home", title: "404-noCache", cache: false, layout: LayoutFull },
    alias: ["/:pathMatch(.*)*", "/404-noCache"],
    components: { default: () => import("@/views/404/index.vue") }
  }
];

function generateRoute(routes: RouteRaw[]) {
  const result: RouteRecordRaw[] = [];
  routes.forEach((route) => {
    const layout = route.meta.layout;

    defaultsDeep(route, {
      props: true,
      name: `${route.meta.layout.name}-${route.path.replace(/\//g, "-") || "index"}`,
      alias: [`/${route.path}`],
      meta: { cache: true }
    } as RouteRaw);

    let index = result.findIndex((r) => r.component === layout);
    if (index === -1) {
      const name = layout.name;
      const data = {
        path: `/${name}`,
        name: `layout-${name}`,
        component: layout,
        children: []
      };
      data.children.push(defaultsDeep({ parent: data }, route));
      result.push(data);
    } else {
      result[index]!.children.push(defaultsDeep({ parent: result[index] }, route));
    }
  });
  return result;
}

const history =
  import.meta.env.VITE_ROUTER_HISTORY === "hash" ? createWebHashHistory() : createWebHistory();

export const routes: RouteRecordRaw[] = generateRoute(baseRoutes);

export const navList: LayoutNav[] = baseRoutes
  .filter((f) => !get(f.meta, "hidden", false))
  .map((r) => {
    return defaultsDeep({ path: `/${r.meta.layout?.name}/${r.path}` }, r.meta);
  });

export const router = createRouter({
  history,
  routes
});
