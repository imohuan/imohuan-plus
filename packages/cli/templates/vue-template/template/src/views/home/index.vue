<template>
  <div class="wh-full center flex-col space-y-2">
    <q-btn color="primary" label="Echo" @click="onEcho"></q-btn>
    <q-btn color="primary" label="Println" @click="onPrintLn"></q-btn>
    <q-btn color="primary" label="404" @click="on404" />
    <div class="center space-x-2">
      <span>使用图标</span>
      <i-illustrations-login_flowers class="-rotate-90" />
    </div>
    <el-button>Element-UI</el-button>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();

const onEcho = () => {
  echo.log("测试 Echo", echo.asWarning("warn"), echo.asAlert("alert"));
};

const onPrintLn = () => {
  println(__APP_INFO__);
};

const on404 = () => {
  router.push({ path: "/" + Math.random() });
};
</script>

<style scoped lang="scss"></style>
