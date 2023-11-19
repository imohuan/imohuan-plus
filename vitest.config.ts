import { configDefaults, defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, "example/**"],
    testTimeout: 1000 * 1000
  }
});
