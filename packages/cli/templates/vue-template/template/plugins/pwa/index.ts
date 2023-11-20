import { VitePWA } from "vite-plugin-pwa";

export function Pwa(env: ViteEnv) {
  return VitePWA({
    base: "/",
    minify: true,
    mode: "development",
    includeAssets: ["favicon.svg", "favicon.ico", "robots.txt"],
    registerType: "autoUpdate",
    manifest: {
      name: "Imohuan-Vue3-Template",
      short_name: "Imohuan",
      description: "基于vite + vue3 的简单应用",
      theme_color: "#ffffff",
      display: "standalone",
      icons: [
        { src: "android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
        { src: "android-chrome-512x512.png", sizes: "512x512", type: "image/png" }
      ]
    },
    workbox: {
      globPatterns: [],
      cleanupOutdatedCaches: false,
      runtimeCaching: [
        {
          urlPattern: new RegExp(`/${env.VITE_PROXY_DOMAIN}`, "i"),
          handler: "CacheFirst",
          options: { cacheName: "interface-cache" }
        },
        {
          urlPattern: /(.*?)\.(js|scss|css|ts)/, // js|scss|css|ts静态资源缓存
          handler: "CacheFirst",
          options: { cacheName: "js-css-cache" }
        },
        {
          urlPattern: /(.*?)\.(png|jpe?g|svg|gif|bmp|psd|tiff|tga|eps)/, // 图片缓存
          handler: "CacheFirst",
          options: { cacheName: "image-cache" }
        }
      ]
    },
    devOptions: {
      enabled: process.env.SW_DEV === "true",
      type: "module",
      navigateFallback: "index.html"
    }
  });
}
