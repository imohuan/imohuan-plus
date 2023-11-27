//只是编辑器提供提示的文件
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  safelist: [],
  theme: {
    extend: {
      spacing: { full: "100%" },
      colors: {
        "tw-primary": "var(--primary)",
        "tw-secondary": "var(--secondary)",
        "tw-accent": "var(--accent)",
        "tw-dark": "var(--dark)",
        "tw-positive": "var(--positive)",
        "tw-negative": "var(--negative)",
        "tw-info": "var(--info)",
        "tw-warning": "var(--warning)",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities, matchUtilities, theme }) {
      const newUtilities = {
        ".center": {
          display: "flex",
          "justify-content": "center",
          "align-items": "center",
        },
        ".between": {
          display: "flex",
          "justify-content": "space-between",
          "align-items": "center",
        },
        ".around": {
          display: "flex",
          "justify-content": "space-around",
          "align-items": "center",
        },
        ".absolute-x-center": {
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        },
        ".absolute-y-center": {
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
        },
        ".flex-start ": {
          display: "flex",
          "justify-content": "flex-start",
          "align-items": "flex-start",
        },
        ".flex-end ": {
          display: "flex",
          "justify-content": "flex-end",
          "align-items": "flex-end",
        },
        ".scroll-y-hidden": {
          "overflow-x": "hidden",
          "overflow-y": "auto",
        },
        ".scroll-y-hidden::-webkit-scrollbar ": {
          height: "0px",
          width: "0px",
        },
        ".scroll-xy": {
          overflow: "auto",
        },
        ".scroll-xy::-webkit-scrollbar ": {
          height: "8px",
          width: "8px",
        },
        ".scroll-xy::-webkit-scrollbar-thumb ": {
          background: "rgba(0, 0, 0, 0.2)",
        },
        ".scroll-x-hidden": {
          overflow: "auto",
        },

        /* 滚动条整体部分，可以设置宽度等 */
        ".scroll-x-hidden::-webkit-scrollbar ": {
          height: "0",
          width: "8px",
        },

        /* 滚动的滑块 */
        ".scroll-x-hidden::-webkit-scrollbar-thumb ": {
          background: "rgba(0, 0, 0, 0.2)",
        },
        ".scroll-x ": {
          "overflow-x": "auto",
          "overflow-y": "hidden",
        },
        ".scroll-bar-none::-webkit-scrollbar": {
          width: "0px!important",
          height: "0px!important",
        },
        ".scroll-scrollbar-width-4px::-webkit-scrollbar": {
          width: "4px!important",
          height: "4px!important",
        },
        ".scroll-scrollbar-width-8px::-webkit-scrollbar": {
          width: "8px!important",
          height: "8px!important",
        },
        ".scroll-scrollbar-width::-webkit-scrollbar": {
          width: "10px!important",
          height: "10px!important",
        },
        /* 滚动条整体部分，可以设置宽度等 */
        ".scroll-x::-webkit-scrollbar": {
          height: "8px",
        },
        /* 滚动的滑块 */
        ".scroll-x::-webkit-scrollbar-thumb ": {
          background: "rgba(0, 0, 0, 0.2)",
        },
        ".scroll-y ": {
          "overflow-x": "hidden",
          "overflow-y": "auto",
        },

        /* 滚动条整体部分，可以设置宽度等 */
        ".scroll-y::-webkit-scrollbar ": {
          width: "8px",
        },
        /* 滚动的滑块 */
        ".scroll-y::-webkit-scrollbar-thumb ": {
          width: "10px",
          background: "rgba(0, 0, 0, 0.2)",
        },
        ".clearfix::after ": {
          content: "",
          display: "block",
          clear: "both",
        },
        ".capitalize": {
          "text-transform": "capitalize",
        },
        // 优化css渲染速度
        ".content-visibility": {
          "content-visibility": "auto",
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);

      matchUtilities(
        {
          wh: (value) => ({ width: value, height: value }),
          "grid-auto-w": (value) => ({ "grid-template-columns": `repeat(auto-fill, ${value})` }),
          "grid-auto-h": (value) => ({ "grid-template-rows": `repeat(auto-fill, ${value})` }),
        },
        { values: theme("spacing") }
      );
    }),
  ],
};
