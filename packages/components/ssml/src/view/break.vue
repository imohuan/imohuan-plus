<template>
  <n-popover ref="root" v-bind="popoverBind">
    <template #trigger>
      <span :class="['hover:bg-blue-200', show ? 'bg-blue-300' : 'bg-blue-500']">
        {{ strength }}
      </span>
    </template>
    <div>
      <n-button-group size="small">
        <n-button round @click="handleEditor({ time: 0 })"> 无停顿 </n-button>
        <n-button ghost @click="handleEditor({ time: 200 })">
          <template #icon>
            <div class="line-box">
              <span class="line line-1"></span>
            </div>
          </template>
          短
        </n-button>
        <n-button ghost @click="handleEditor({ time: 600 })">
          <template #icon>
            <div class="line-box">
              <span class="line line-1"></span>
              <span class="line line-2"></span>
            </div>
          </template>
          中
        </n-button>
        <n-button round @click="handleEditor({ time: 1000 })">
          <template #icon>
            <div class="line-box">
              <span class="line line-1"></span>
              <span class="line line-2"></span>
              <span class="line line-3"></span>
            </div>
          </template>
          长
        </n-button>
      </n-button-group>
      <span class="mx-3 text-gray-200">|</span>
      <n-button size="small" @click="handleRemove"> 移除 </n-button>
    </div>
  </n-popover>
</template>

<script setup lang="ts">
import { NPopover } from "naive-ui";
import { NButtonGroup, NButton } from "naive-ui";
import { computed } from "vue";
import { useSsml } from "./hooks/useSsml";

export interface Props {
  time: number | string;
}

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<Props>(), { time: 100 });
const { root, show, popoverBind, handleRemove, handleEditor } = useSsml();

const strength = computed(() => {
  const milliseconds = parseInt(props.time.toString());
  if (milliseconds === 0) {
    return "无停顿";
  } else if (milliseconds < 300) {
    return "短";
  } else if (milliseconds >= 300 && milliseconds < 700) {
    return "中";
  } else {
    return "长";
  }
});
</script>

<style scoped lang="scss">
$bg-color: rgb(255, 136, 0);

:global(.ssml-popover) {
  // margin-top: 2px !important;
  // border: 1px solid rgb(77, 73, 73);
}

.line-box {
  display: flex;
  align-items: end;
  height: 14px;
}

.line {
  width: 2px;
  margin: 0 1px;
  vertical-align: sub;
  background: $bg-color;
}

.line-1 {
  height: 5px;
}
.line-2 {
  height: 8px;
}
.line-3 {
  height: 10px;
}
</style>
