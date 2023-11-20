<template>
  <div class="wh-full flex-col">
    <div class="h14 w-full shadow-md px4 between">
      <div class="center space-x-20">
        <span class="text-lg first-letter:uppercase font-mono"> Path: {{ route.path }} </span>
        <span class="text-lg first-letter:uppercase font-mono">
          Layout: {{ String(route.name).split("-")[0] }}
        </span>
      </div>
      <div class="center space-x-2">
        <q-btn label="主题" color="primary">
          <q-popup-proxy :offset="[0, 10]" anchor="bottom middle" self="top middle">
            <q-color
              v-model="color"
              no-header
              no-footer
              class="my-picker"
              @change="onChangeTheme"
            />
          </q-popup-proxy>
        </q-btn>
        <q-btn
          v-for="nav in navList"
          outline
          color="primary"
          :label="nav.title"
          class="min-w20!"
          @click="go(nav)"
        />
      </div>
    </div>
    <im-view />
  </div>
</template>

<script lang="ts" setup>
import { routerEach } from "@/router/each";
import { ctx } from "@/helper/ctx";
import { navList } from "./router";
import { LayoutNav } from "./typings";
import { debounce } from "lodash-es";

/** 初始化主题 */
ctx.theme.set();
/** 初始化路由 */
routerEach();

const route = useRoute();
const router = useRouter();
const color = ref(ctx.theme.get().primary);

const go = (nav: LayoutNav) => {
  console.log("nav", nav);
  router.push(nav.path);
};

const onChangeTheme = debounce(() => {
  ctx.theme.set({ primary: color.value });
}, 100);

onMounted(() => {
  setTimeout(() => {
    document.getElementById("loading-absolute").style.display = "none";
  }, 1000);
});
</script>
