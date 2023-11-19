<template>
  <div class="flex flex-col space-y-1 min-h-[300px]" :style="`width:${width}px;height: ${height}px`">
    <div ref="color" class="color" :style="cptColor">
      <div class="sphere" :style="cptPosition"></div>
    </div>
    <div ref="rail" class="rail">
      <div class="rect" :style="cptRailX"></div>
    </div>
    <div ref="alpha" class="alpha">
      <div class="wh-full" :style="cptAplhaColor">
        <div class="rect" :style="cptAplhaX"></div>
      </div>
    </div>
    <div class="flex space-x-2">
      <div class="flex-1 grid grid-cols-12 gap-1 scroll-y" :style="`max-height: ${gW * 2 + 4}px`">
        <div
          class="alpha w-full bg-violet-200 rounded overflow-hidden hover:border-[2px] border-black"
          v-for="(item, index) in state.preview"
          :key="index"
          :style="`height: ${gW}px`"
          @click="handleColorClick(item)"
        >
          <div class="wh-full" :style="`background: ${item}`"></div>
        </div>
      </div>
      <div :style="`width: ${gW}px`">
        <icon-svg
          name="add"
          class="p-1 border-2 rounded hover:bg-slate-300 active:bg-slate-400 hover:border-black"
          :style="`width: ${gW}px;height: ${gW}px`"
          @click="handleAddClick"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { clamp } from "lodash-es";
import { getValue, Hsva, parseColor } from "./color";
import { getPosition, setDragMove, getParseInt } from "./helper";
import { ref, reactive, computed, onMounted, PropType } from "vue";
import { useAutoColumn } from "@/hooks/useAutoColumn";

type Format = "hsl" | "rgb" | "hex";
const defaultPreview: string[] = ["rgba(57, 118, 163, 1)", "rgba(64, 5, 23, 0.73)"];

const props = defineProps({
  color: { type: String, required: false, default: "#fd0b00" },
  format: { type: String as PropType<Format>, default: "rgb" },
  width: { type: Number, default: 400 },
  height: { type: Number, default: 300 },
  preview: { type: Array as PropType<string[]>, default: () => [] }
});

const emits = defineEmits(["update:color"]);
const gW = getParseInt((props.width - 50) / 12 - 4);
// const { cptGrid, distance } = useAutoColumn(props.width, { gap: 4, width: 25 });

interface State {
  hsva: Hsva; // h s v a
  iconColor: string;
  railX: number; // 色条的位置
  aplhaX: number; // 透明度条的位置
  position: { x: number; y: number };
  preview: string[];
}

const color = ref();
const rail = ref();
const alpha = ref();

const state = reactive<State>({
  hsva: { h: 360, s: 1, v: 1, a: 1 },
  iconColor: "white",
  railX: 0,
  aplhaX: 0,
  position: { x: 0, y: 0 },
  preview: props.preview.length === 0 ? defaultPreview : props.preview
});

// 根据css提供的宽度进行计算，如果修改需要同时修改css
const sphereWidth = 10 / 2;
const rectWidth = 8 / 2;

const cptColor = computed(() => `background: hsl(${state.hsva.h}, 100%, 50%)`);
const cptPosition = computed(() => `top: ${state.position.y}px; left: ${state.position.x}px;border-color: ${state.iconColor}`);
const cptRailX = computed(() => `left: ${state.railX}px;`);
const cptAplhaX = computed(() => `left: ${state.aplhaX}px;`);
const cptAplhaColor = computed(() => `background: linear-gradient(to right, transparent, hsl(${state.hsva.h}, 100%, 50%))`);

const updateColor = () => emits("update:color", getValue(props.format, state.hsva));
const initColor = (pColor: string) => {
  // 初始化颜色
  state.hsva = parseColor(pColor) || { h: 360, s: 1, v: 1, a: 1 };
  // 初始化坐标 通过hsva反向计算
  const { width, height } = color.value.getBoundingClientRect();
  state.position = { x: width * state.hsva.s - sphereWidth, y: height * (1 - state.hsva.v) - sphereWidth };
  const railWidth = rail.value.getBoundingClientRect().width;
  state.railX = clamp(railWidth * (state.hsva.h / 360), 0, railWidth - rectWidth * 2);
  const alphaWidth = alpha.value.getBoundingClientRect().width;
  state.aplhaX = clamp(alphaWidth * (state.hsva.a || 1), 0, alphaWidth - rectWidth * 2);
};

const handleColorMove = (el: HTMLElement, e: MouseEvent) => {
  const { x, y, scaleX, scaleY } = getPosition(el, e);
  state.position = { x: x - sphereWidth, y: y - sphereWidth };
  state.hsva.s = scaleX;
  state.hsva.v = getParseInt(1 - scaleY);
  state.iconColor = scaleX < 0.3 && scaleY < 0.3 ? "black" : "white";
  updateColor();
};

const handleRailMove = (el: HTMLElement, e: MouseEvent) => {
  const { x, scaleX } = getPosition(el, e);
  state.railX = clamp(x, 0, el.offsetWidth - rectWidth * 2);
  state.hsva.h = scaleX * 360;
  updateColor();
};

const handleAplhaMove = (el: HTMLElement, e: MouseEvent) => {
  const { x, scaleX } = getPosition(el, e);
  state.aplhaX = clamp(x, 0, el.offsetWidth - rectWidth * 2);
  state.hsva.a = scaleX;
  updateColor();
};

const handleColorClick = (color: string) => {
  initColor(color);
  updateColor();
};

const handleAddClick = () => {
  if (!state.preview.includes(props.color)) {
    state.preview.push(props.color);
  }
};

onMounted(() => {
  if (!color.value || !rail.value || !alpha.value) return;
  initColor(props.color);
  setDragMove(color.value, handleColorMove);
  setDragMove(rail.value, handleRailMove);
  setDragMove(alpha.value, handleAplhaMove);
});

defineExpose({ initColor });
</script>

<style lang="scss" scoped>
.color {
  @apply relative flex-1;

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

.sphere {
  @apply absolute w-[10px] h-[10px] border-2 border-gray-200 rounded-full z-10 transition-[border-color] duration-300;
}

.rail,
.alpha {
  @apply w-full h-[14px] relative;
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
  box-shadow: rgba(0, 0, 0, 0.8) 0px 0px 1px 0px;
  @apply absolute w-[8px] h-full bg-white scale-105;
}
</style>
