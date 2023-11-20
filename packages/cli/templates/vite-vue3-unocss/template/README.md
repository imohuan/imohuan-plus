## 介绍

该项目包含 `vue, vite, element-plus, vueuse, unocss, scss`

帮你快速搭建前端应用

## 项目指令

- 运行项目 `pnpm dev`
- 编译项目 `pnpm build`
- 预览项目 `preview`

## 添加全局申明

`typings/global.d.ts`

## 配置为 Nika 前端

文档地址：https://bramblex.github.io/niva/docs/intro

1. 下载 Nika 客户端 https://github.com/bramblex/niva/releases
2. 选择项目 -> 当前项目目录
3. 声明文件: https://github.com/bramblex/niva/blob/main/packages/types/Niva_zh.d.ts

## 配置为 utools 前端

1. 安装依赖 - TypeScript 的声明包

   `pnpm add utools-api-types -D`

2. 将声明添加如 `tsconfig.json`

```json
{
  "compilerOptions": {
    "types": ["utools-api-types"]
  }
}
```

3. 添加 utools 的配置文件 `public`

`public/plugin.json`

```json
{
  "main": "index.html",
  "logo": "logo.jpg",
  "preload": "preload.js",
  "development": {
    "main": "http://127.0.0.1:5173/"
  },
  "features": [
    {
      "code": "OCR",
      "explain": "截屏翻译",
      "cmds": [
        "截图翻译",
        "screen-translate",
        {
          "type": "img",
          "label": "图片OCR翻译"
        }
      ]
    }
  ]
}
```

`public/preload.js`

```javascript
const { clipboard } = require("electron");
window.readText = () => clipboard.readText();
window.readImage = () => {
  const img = clipboard.readImage();
  if (!img.isEmpty()) clipboard.clear();
  return img;
};
```

`typings/global.d.ts`

```typescript
declare global {
  function readText(): any;
  function readImage(): any;
}
export {};
```
