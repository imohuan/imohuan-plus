import { presetMini, presetUno, presetWind, transformerDirectives } from "unocss";
import { presetScalpel } from "unocss-preset-scalpel";
import { presetScrollbar } from "unocss-preset-scrollbar";
import _Unocss from "unocss/vite";

import presetAttributify from "@unocss/preset-attributify";

// __unocss
export function Unocss() {
  return _Unocss({
    presets: [
      // 默认预设
      presetUno(),
      // Tailwind / Windi CSS 紧凑预设
      presetWind(),
      // html 属性编辑 css
      presetAttributify() as any,
      // 最小但必不可少的规则和变体
      presetMini(),
      // 滚动条 https://github.com/action-hong/unocss-preset-scrollbar
      presetScrollbar(),
      // 手术刀
      presetScalpel({})
    ],
    transformers: [transformerDirectives()],
    theme: {
      colors: {
        tw: {
          primary: "var(--primary)",
          secondary: "var(--secondary)",
          accent: "var(--accent)",
          dark: "var(--dark)",
          positive: "var(--positive)",
          negative: "var(--negative)",
          info: "var(--info)",
          warning: "var(--warning)"
        }
      },
      breakpoints: {
        xs: "320px",
        sm: "640px"
      }
    },
    shortcuts: [
      {
        center: "flex items-center justify-center",
        "center-x": "flex items-center",
        "center-y": "flex justify-center",
        between: "flex items-center justify-between",
        around: "flex items-center space-around",
        "absolute-x-center": "absolute left-50% -translate-x-50%",
        "absolute-y-center": "absolute top-50% -translate-y-50%",
        "absolute-center": "absolute left-50% top-50% -translate-x-50% -translate-y-50%",
        speed: "content-visibility-auto",
        "wh-full": "w-full h-full",
        "scroll-x": "overflow-y-hidden overflow-x-auto",
        "scroll-y": "overflow-x-hidden overflow-y-auto",
        "scrollbar-x": "scrollbar scrollbar-h-2 scrollbar-thumb-color-gray-400",
        "scrollbar-y": "scrollbar scrollbar-w-2 scrollbar-thumb-color-gray-400",
        "scrollbar-xy": "scrollbar-x scrollbar-y"
      },
      [/^btn-(.*)$/, ([, c]) => `bg-${c}-400 text-${c}-100 py-2 px-4 rounded-lg`]
    ],
    rules: [
      [/^wh-(\d+)$/, ([, d]) => ({ width: `${d}px`, height: `${d}px` })],
      [
        /^wh(\d+)$/,
        ([, d]) => ({ width: `${parseInt(d) / 4}rem`, height: `${parseInt(d) / 4}rem` })
      ],
      [
        /^grid-auto-w-(\d+)$/,
        ([, d]) => ({
          gridTemplateColumns: `repeat(auto-fill, ${d}px)`
        })
      ],
      [
        /^grid-auto-h-(\d+)$/,
        ([, d]) => ({
          gridTemplateRows: `repeat(auto-fill, ${d}px)`
        })
      ]
    ]
  });
}
