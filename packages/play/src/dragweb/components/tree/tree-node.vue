<template>
  <div :class="['tree-node flex items-center']">
    <div v-for="(_, i) in layer" :key="i" :class="computedClass(i)"></div>
    <div v-if="nodeData.children && nodeData.children.length > 0" class="tree-icon center" @click="handleToggle">
      <icon-svg v-if="nodeData.open" class="w-4 h-4" name="fold" />
      <icon-svg v-else class="w-4 h-4" name="unfold" />
    </div>

    <div
      v-bind="$attrs"
      :class="[dragClass, 'flex-1 w-full relative font-bold text-xs hover:bg-gray-200 p-1 tree-title']"
      :draggable="true"
      @dragstart="handleStart"
      @dragenter="handleEnter"
      @dragleave="handleLeave"
      @dragend="handleEnd"
    >
      <div class="tree-placeholder"></div>
      <div class="flex-1 wh-full" @dragover.prevent="handleOver" @drop="handleDrop">
        {{ (nodeData.option && nodeData.option.title) || nodeData.title || nodeData.tag }}
      </div>
    </div>
  </div>

  <el-collapse-transition>
    <div ref="treeNodeContainer" v-show="cptShow" :class="[{ 'select-none pointer-events-none': !cptShow || (isDragCurrent && isDrag) }]">
      <tree-node
        v-for="(item, i) in nodeData.children"
        :key="i"
        :hidden-indexs="cptHidenIndex"
        :parent-list="nodeData.children"
        :node-data="item"
        :layer="layer + 1"
        :index="i"
      />
    </div>
  </el-collapse-transition>
</template>

<script setup lang="ts">
import EventEmitter from "events";
import { computed, inject, ref } from "vue";
import { getDistanceInElement } from "./helper";
import { DirectionType } from "./types";
import { isArray, set } from "lodash-es";
import { strcopy } from "@/helper";

const props = defineProps({
  nodeData: { type: Object, required: true },
  parentList: { type: Array, required: true },
  index: { type: Number, required: true },
  hiddenIndexs: { type: Array, required: false, default: () => [] },
  layer: { type: Number, required: true }
});

const distance = inject<number>("distance") || 0.2;
const isDrag = inject<boolean>("isDrag");
const emitters = inject<EventEmitter>("event") as EventEmitter;
const direction = ref<DirectionType>("none");
const treeNodeContainer = ref();
const dragClass = computed(() => (direction.value === "none" ? "" : `drag-${direction.value}`));
const isDragCurrent = ref(false);
set(props.nodeData, "open", true);
if (!props.nodeData.id) set(props.nodeData, "id", Math.random().toString().slice(2));

// #region 拖拽事件
const handleStart = (e: DragEvent) => {
  emitters.emit("start", {
    event: e,
    data: { el: e.target as HTMLElement, parent: props.parentList, current: props.nodeData, container: treeNodeContainer.value }
  });
  isDragCurrent.value = true;
};

const handleOver = (e: DragEvent) => {
  const target = e.target as HTMLElement;
  if (!e.dataTransfer) return;
  e.dataTransfer.dropEffect = "move";

  const dn = getDistanceInElement(distance, { x: e.offsetX, y: e.offsetY }, target.getBoundingClientRect(), "y");
  direction.value = dn > 0 ? "after" : dn === 0 ? "over" : "before";

  emitters.emit("over", {
    event: e,
    data: { el: e.target as HTMLElement, parent: props.parentList, current: props.nodeData, container: treeNodeContainer.value }
  });
};

const handleEnter = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  emitters.emit("enter", {
    event: e,
    data: { el: e.target as HTMLElement, parent: props.parentList, current: props.nodeData, container: treeNodeContainer.value }
  });
};

const handleLeave = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  emitters.emit("leave", {
    event: e,
    data: { el: e.target as HTMLElement, parent: props.parentList, current: props.nodeData, container: treeNodeContainer.value }
  });
  direction.value = "none";
};

const handleEnd = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();

  emitters.emit("end", {
    event: e,
    data: { el: e.target as HTMLElement, parent: props.parentList, current: props.nodeData, container: treeNodeContainer.value }
  });
  direction.value = "none";
  isDragCurrent.value = false;
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  emitters.emit("drop", {
    event: e,
    data: {
      el: e.target as HTMLElement,
      parent: props.parentList,
      current: props.nodeData,
      container: treeNodeContainer.value,
      direction: direction.value
    }
  });
  direction.value = "none";
};
// #endregion

// #region 处理基础样式
const cptShow = computed(() => props.nodeData.children && props.nodeData.children.length > 0 && props.nodeData.open);

const cptHidenIndex = computed(() => {
  // 如果数组中只有一个子节点将不显示前面的线条  | |_ 变成 |_
  const isHidden = props.index === props.parentList.length - 1 && props.nodeData.children && props.nodeData.children.length > 0;
  const result: any = strcopy(props.hiddenIndexs || []);
  isHidden && result.push(props.layer);
  return result;
});

// 通过传递的属性返回该元素对应的节点
const computedClass = (i: number) => {
  // index 嵌套的层数   i 当前元素的索引位置
  const classlist = ["line"];
  const isRepeat = props.layer === i + 1;
  const isHasChild = isArray(props.nodeData.children) && props.nodeData.children.length > 0;

  // 如果是最后一个元素，则添加 line-repeat 相当显示为  |- 这样的符号
  if (isRepeat) classlist.push("line-repeat");
  // 对应层的节点隐藏，因为这里会显示展开|缩放按钮
  if (isHasChild && isRepeat) classlist.push("hidden");
  // 隐藏不必要的线条 |
  if (props.hiddenIndexs && props.hiddenIndexs.length > 0) {
    props.hiddenIndexs.forEach((index) => {
      index === i + 1 && classlist.push("opacity-0");
    });
  }
  // 如果是数组末尾渲染的节点， 隐藏下半截线条 |_
  if (i === props.layer - 1 && props.index === props.parentList.length - 1) classlist.push("line-end");
  return classlist;
};

const handleToggle = () => {
  set(props.nodeData, "open", !props.nodeData.open);
};

// #endregion
</script>
