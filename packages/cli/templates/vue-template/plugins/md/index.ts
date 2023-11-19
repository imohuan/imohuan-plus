import Markdown, { link, meta } from "vite-plugin-md";

export function Md() {
  return Markdown({
    headEnabled: true,
    markdownItOptions: {
      html: true,
      linkify: true,
      typographer: true
    },
    markdownItSetup(md) {
      md.use(require("markdown-it-anchor"));
      md.use(require("markdown-it-prism"));
    },
    builders: [link(), meta()]
  });
}
