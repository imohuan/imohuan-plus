<template>
  <div
    class="tree-root wh-full select-none pt-2 pb-4"
    @dragover="handleContainerOver"
    @dragleave="handleContainerEnd"
    @dragend.prevent="handleContainerEnd"
    @drop.prevent="handleContainerDrop"
  >
    <div :class="['w-full relative pl-1 pr-2 max-h-full', boxCls]">
      <tree-node v-for="(item, index) in list" :key="index" :index="index" :layer="1" :parent-list="list" :node-data="item" />
      <div class="tree-placeholder drag-container-after"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import mitt from "mitt";
import { provide, ref } from "vue";
import { DragData, DragItemData, DirectionType } from "./types";
import { get, set } from "lodash-es";
import { strcopy } from "@/helper";

const props = defineProps({
  distance: { type: Number, required: false, default: 0.2 },
  root: { type: Boolean, default: false },
  copy: { type: Boolean, default: false },
  list: { type: Object, default: () => ({}) }
});

const emitters = mitt();
const boxCls = ref("");
const isDrag = ref(false);
const isOpen = ref(false);

provide("event", emitters);
provide("isDrag", isDrag);
provide("distance", props.distance);
const dragData: DragData = { start: null, end: null };

//#region 拖拽相关
const handleStart = (args: { event: DragEvent; data: DragItemData }) => {
  dragData.start = args.data;
  // 禁止拖拽标有disabled的数据
  if (get(args.data.current.option, "disabled", false)) args.event.preventDefault();
  setTimeout(() => {
    isDrag.value = true;
  }, 100);
  isOpen.value = get(args.data.current, "open", true);
  // set(args.data.current, "open", false);
};

const handleOver = (args: { event: DragEvent; data: DragItemData }) => {};

const handleEnd = (args: { event: DragEvent; data: DragItemData }) => {
  isDrag.value = false;
  args.event.dataTransfer!.clearData();
  set(args.data.current, "open", isOpen.value);
};

const handleEnter = (args: { event: DragEvent; data: DragItemData }) => {};

const handleLeave = (args: { event: DragEvent; data: DragItemData }) => {};

const handleDrop = (args: { event: DragEvent; data: DragItemData & { direction: DirectionType } }) => {
  dragData.end = args.data;
  const { start, end } = dragData;
  const direction = args.data.direction;

  if (
    !end ||
    !args.event.dataTransfer ||
    (direction === "over" && get(end.current && end.current.option, "noChildren", false)) ||
    !direction ||
    direction === "none"
  )
    return;
  // 判断是否是Container容器执行的当前事件

  let targetIndex = !end.current ? (["over", "after"].includes(direction) ? end.parent.length : 0) : end.parent.indexOf(end.current);
  if (targetIndex === -1) return;

  // #region 复制的逻辑 从其他位置拖拽的数据
  const type = args.event.dataTransfer.getData("type");
  const strdata = args.event.dataTransfer.getData("data");

  if (type === "copy") {
    const data = JSON.parse(strdata);
    direction === "over"
      ? set(end.parent[targetIndex], "children", ([] as any).concat(end.parent[targetIndex].children || [], [data]))
      : end.parent.splice(targetIndex + (direction === "before" ? 0 : 1), 0, data);
    return;
  }

  if (!start) return;

  set(args.data.current, "open", isOpen.value);

  // 校验是否支持验证
  // 1. 不能拖拽到子节点
  if (start.el.contains(end.el)) return;
  if (start.container.contains(end.el)) return;
  // 2. 如果禁止拖拽
  if (get(start.current.option, "disabled", false)) return;
  // -----------------------
  const deleteIndex = start.parent.indexOf(start.current);
  const targetData = props.copy ? strcopy(start.current) : start.current;
  targetData.open = isOpen.value;

  if (deleteIndex === -1 || targetIndex === -1) return;
  start.parent.splice(deleteIndex, 1);

  // 重新获取 targetIndex, 因 处理边界情况, 如果被删除的数据和拖拽位置的父级是相同的,则获取到的索引就可能不正确, 这里需要重新获取对应的索引
  targetIndex = !end.current ? (["over", "after"].includes(direction) ? end.parent.length : 0) : end.parent.indexOf(end.current);
  if (direction === "before") {
    end.parent.splice(targetIndex, 0, targetData);
  } else if (direction === "after") {
    end.parent.splice(targetIndex + 1, 0, targetData);
  } else if (direction === "over") {
    console.log(end.parent[targetIndex], targetIndex, end.parent, end.current);
    // 判断对象是否存在子对象
    if (!end.parent[targetIndex]) return;
    if (!get(end.parent[targetIndex], "children", false)) end.parent[targetIndex].children = [];
    end.parent[targetIndex].children!.push(targetData);
  }
  //#endregion
};

const handleContainerOver = (event: DragEvent) => {
  const target = event.target as HTMLElement;
  if (!target.classList.contains("tree-root")) return;
  // const distance = getDistanceInElement(0.5, { x: event.offsetX, y: event.offsetY }, target.children[0].getBoundingClientRect(), "y");
  // boxCls.value = distance >= 1 ? "drag-after" : "drag-before";
  const containerHeight = (target.children[0] as HTMLElement).offsetHeight;
  boxCls.value = event.offsetY < containerHeight / 2 ? "drag-before" : "drag-after";
};

const handleContainerEnd = () => {
  boxCls.value = "none";
};

const handleContainerDrop = (e: DragEvent) => {
  emitters.emit("drop", {
    event: e,
    data: { el: e.target as HTMLElement, parent: props.list, current: null, direction: boxCls.value.replace("drag-", "") }
  });
  boxCls.value = "none";
};

// #endregion

// 绑定事件
const events = {
  start: handleStart,
  over: handleOver,
  end: handleEnd,
  enter: handleEnter,
  leave: handleLeave,
  drop: handleDrop
};

Object.keys(events).forEach((event) => {
  const handle: any = (events as any)[event];
  emitters.on(event, handle);
});
</script>
