import { beforeEach, describe, expect, it } from "vitest";
import { log, hello, get } from "../dist/lib-cjs";

describe("测试", () => {
  it("测试 1", async () => {
    log(..."abcdefghijklmnopqrstuvwxyz".split(""));
    hello();
    console.log(get({ a: 123 }, "a", "none"));
  });
});
