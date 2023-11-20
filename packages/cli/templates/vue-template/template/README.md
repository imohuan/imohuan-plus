## 命令

- 开启服务 `pnpm dev`
- 项目编译 `pnpm build`
- 编译预览 `pnpm preview`
- 执行测试 `pnpm test`
- 端到端测试 `pnpm e2e`
- 修改代码 `pnpm fix`
- 打包为油猴脚本 `pnpm tampermonkey`
- 添加 Electron `pnpm add-electron`

## 介绍

> 项目使用到的库

- `vue3`
- `vue-router`
- `pinia`
- `quasar`
- `element-ui`
- `lodash-es`
- `axios`
- `vueuse/core`
- `vueuse/head`
- `...`

## 测试

> 项目中存在最简单的测试案例，可以快速入门

- `vitest`
- `cypress`

## 插件

- 支持直接导入 `md` 作为组件
- 支持 `pwa`
- 支持 自动导入组件(`components` 中的组件)
- 支持 `Svg` 直接以组件使用 `i-<dirname>-<name>`
- 支持 全局 `api` 使用，不需要提前导入 `plugins/unplugin/script.ts`

- 样式使用 `unocss`，同时预制了 `tailwindcss`

## 脚本插件

- `tampermonkey` 油猴脚本 -> 油猴脚本中实用工具导入即可
- `electron` 软件开发

## 基础目录

- `plugins` Vite 插件
- `public` Web 静态文件
- `scripts` 脚本 | 脚本插件
- `src` 资源目录
- `test` 测试
- `typings` 声明文件
- `background` 初始化 Electron 后， 用于编写 Electron 脚本
