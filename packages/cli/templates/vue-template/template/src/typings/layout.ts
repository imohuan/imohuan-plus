import type { DefineComponent } from "vue";
import type { RouteRecordRaw } from "vue-router";

export interface LayoutNav {
  /** 显示 图标 */
  icon: string;
  /** 地址 */
  path: string;
  /** 标题 */
  title: string;
  /** 是否隐藏 路由 */
  hidden?: boolean;
  /** 是否缓存 默认为 true */
  cache?: boolean;
  /** 过渡 动画 */
  transition?: string;
}

export type RouteRaw = RouteRecordRaw & {
  meta: Partial<LayoutNav> & {
    /** 布局 */
    layout: DefineComponent<{}, {}, any> | any;
    prevPath?: string;
  };
};
