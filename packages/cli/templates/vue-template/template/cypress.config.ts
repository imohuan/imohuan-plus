import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {},
  component: {
    devServer: {
      framework: "vue",
      bundler: "vite"
    },
    specPattern: ["{src,cypress/component}/**/*.{cy,spec}.{js,jsx,ts,tsx}"]
  }
});
