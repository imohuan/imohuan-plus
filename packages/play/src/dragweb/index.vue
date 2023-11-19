<template>
  <div class="wh-full flex flex-col overflow-hidden">
    <!-- 头部 -->
    <div class="px-4 h-12 bg-black text-white flex items-center font-bold">
      <span class="text-lg">Home</span>
    </div>
    <!-- 内容 -->
    <div class="w-full flex-1 flex overflow-hidden">
      <!-- 左侧组件 -->
      <div class="border-r wh-full" style="width: 280px">
        <left-box />
      </div>
      <!-- 中间容器渲染组件 -->
      <div class="flex-1 wh-full flex flex-col bg-gray-100 overflow-hidden">
        <!-- 状态栏 -->
        <div style="height: 40px" class="border-b between bg-white">
          <div class="h-full flex items-center px-2">
            <div class="w-24 px-2 h-full center space-x-2 border-r">
              <div
                :class="['group nav-moblie ', { active: viewSize.isName('moblie') }]"
                @click="viewSize.setCurrent('moblie')"
              >
                <icon-svg class="w-5 h-5 group-hover:text-white" name="moblie" />
              </div>
              <div
                :class="['group nav-pc ', { active: viewSize.isName('pc') }]"
                @click="viewSize.setCurrent('pc')"
              >
                <icon-svg class="w-5 h-5 group-hover:text-white" name="pc" />
              </div>
            </div>

            <!-- 下拉 -->
            <div class="w-28 h-full center border-r" v-show="viewSize.isList">
              <!-- 下拉框 - 设置分辨率 -->
              <div class="group wh-full center font-bold text-xs space-x-1">
                <span>设置分辨率</span>
                <icon-svg
                  class="w-3 h-3 transition-all duration-300 transform group-hover:translate-y-[1px]"
                  name="select"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="flex-1 wh-full p-5 flex justify-center items-start overflow-hidden">
          <iframe
            :class="['wh-full bg-white shadow transition-all', viewSize.current.value.name]"
            :style="viewSize.viewStyle.value"
          ></iframe>
        </div>
        <!-- Console -->
        <div></div>
      </div>
      <!-- 右侧属性组件 -->
      <div class="border-l wh-full" style="width: 280px"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LeftBox from "./components/left-box.vue";
import useViewSize from "./hooks/useViewSize";

const viewSize = useViewSize();
</script>

<style lang="scss">
.nav-pc,
.nav-moblie {
  @apply w-10 h-7 hover:bg-blue-600 center rounded;
  &.active {
    @apply bg-blue-600;
    svg {
      @apply text-white;
    }
  }
}
</style>
