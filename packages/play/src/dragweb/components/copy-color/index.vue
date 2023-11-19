<template>
  <div class="w-[400px] h-64 flex flex-col space-y-1">
    {{ colorStyle }}
    <div ref="color" class="color cursor-crosshair" :style="colorStyle">
      <div class="sphere" :style="sphereStyle"></div>
    </div>
    <div ref="rail" class="rail cursor-crosshair">
      <div class="rect" :style="railMoveStyle"></div>
    </div>

    <div ref="alpha" class="alpha cursor-crosshair">
      <div class="wh-full" :style="alphaColorStyle">
        <div class="rect" :style="alphaMoveStyle"></div>
      </div>
    </div>

    <div class="w-full h-10 border" :style="targetStyle">{{ targetStyle }}</div>
  </div>
</template>

<script setup lang="ts">
import Drag from "./draggable";
import { getValue } from "./helper";
import { ref, reactive, onMounted, computed } from "vue";

let startEl: HTMLElement, startRailEl: HTMLElement, startAlphaEl: HTMLElement;
const rail = ref<HTMLElement>();
const alpha = ref<HTMLElement>();
const color = ref<HTMLElement>();
const colorHsva = reactive({ h: 360, s: 0, v: 0, a: 1 });
const sphere = reactive({ x: 0, y: 0, color: "white" });
const sphereStyle = computed(() => `top:${sphere.y}px;left:${sphere.x}px;border-color:${sphere.color}`);
const colorStyle = computed(() => `background: hsla(${colorHsva.h}, 100%, 50%, 1)`);
const targetStyle = computed(() => `background: ${getValue("hsl", colorHsva)}`);
const handleMove = (e: MouseEvent) => {
  const rect = startEl.getBoundingClientRect();
  const { x, y } = { x: e.clientX, y: e.clientY };
  const targetX = (x < rect.left ? rect.left : x > rect.right ? rect.right : x) - rect.left;
  const targetY = (y < rect.top ? rect.top : y > rect.bottom ? rect.bottom : y) - rect.top;
  const scaleX = +(targetX / rect.width).toFixed(2);
  const scaleY = +(1 - targetY / rect.height).toFixed(2);
  sphere.x = targetX - 5;
  sphere.y = targetY - 5;
  colorHsva.s = scaleX;
  colorHsva.v = scaleY;
  // 如果位置改变更改小球的颜色
  sphere.color = scaleX < 0.1 && scaleY > 0.8 ? "black" : "white";
};

const railMove = ref(0);
const railMoveStyle = computed(() => `left:${railMove.value - 4}px`);
const handleMoveRail = (e: MouseEvent) => {
  const rect = startRailEl.getBoundingClientRect();
  const x = e.clientX;
  const targetX = (x < rect.left ? rect.left : x > rect.right ? rect.right : x) - rect.left;
  const scaleX = +((targetX / rect.width) * 360).toFixed(2);
  railMove.value = targetX;
  colorHsva.h = scaleX;
};

const alphaMove = ref(0);
const alphaColor = ref("#ffffff");
const alphaMoveStyle = computed(() => `left:${alphaMove.value - 4}px`);
const alphaColorStyle = computed(() => `background: linear-gradient(to right, transparent, ${alphaColor.value});`);
const handleMoveAlpha = (e: MouseEvent) => {
  const rect = startAlphaEl.getBoundingClientRect();
  const x = e.clientX;
  const targetX = (x < rect.left ? rect.left : x > rect.right ? rect.right : x) - rect.left;
  const scaleX = +(targetX / rect.width).toFixed(2);
  alphaMove.value = targetX;
  colorHsva.a = scaleX;
};

onMounted(() => {
  if (!color.value || !rail.value || !alpha.value) return;

  Drag(color.value, {
    start: (e: MouseEvent) => {
      startEl = e.target as any;
      console.log(e.target);
    },
    move: handleMove,
    end: handleMove
  });

  Drag(rail.value, {
    start: (e: MouseEvent) => (startRailEl = e.target as any),
    move: handleMoveRail,
    end: handleMoveRail
  });

  Drag(alpha.value, {
    start: (e: MouseEvent) => (startAlphaEl = e.target as any),
    move: handleMoveAlpha,
    end: handleMoveAlpha
  });
});
</script>

<style lang="scss" scoped>
.color {
  @apply relative flex-1;

  .sphere {
    @apply absolute w-[10px] h-[10px] border-2 rounded-full z-10;
  }

  &::before,
  &::after {
    @apply content-[''] absolute top-0 left-0 wh-full;
  }

  &::before {
    background: linear-gradient(to right, white, transparent);
  }

  &::after {
    background: linear-gradient(to top, black, transparent);
  }
}

.rail,
.alpha {
  @apply w-full h-[12px] relative;
}

.rect,
.sphere {
  @apply pointer-events-none;
}

.rail {
  background: linear-gradient(90deg, red, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, red);
}

.alpha {
  background-image: linear-gradient(45deg, #c5c5c5 25%, transparent 0, transparent 75%, #c5c5c5 0, #c5c5c5),
    linear-gradient(45deg, #c5c5c5 25%, transparent 0, transparent 75%, #c5c5c5 0, #c5c5c5);
  background-size: 10px 10px;
  background-position: 0 0, 5px 5px;
}

.rect {
  @apply absolute w-[8px] h-full border border-gray-400 bg-white;
}
</style>
