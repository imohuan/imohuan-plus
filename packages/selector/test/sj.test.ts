import { describe, expect, it } from "vitest";
import { sj } from "../src/core/str";

describe("sj", () => {
  it("Sj function test", async () => {
    const content = "{  url: 'https://22222', sdf: 'https://33333' }";
    expect(sj(content, "{", "}")).toBe(content);
    expect(sj(content, "{", "}", "first", true)).toBe(content.slice(1, -1));
    expect(sj(content, "https:", "'", "last", false)).toBe("https://33333'");
    expect(sj(content, "https:", "'", "first", false)).toBe("https://22222'");
    expect(sj(content, "'", "'", "last", true)).toBe("https://33333");
    expect(sj(content, "'", "'", "first", true)).toBe("https://22222");
  });
});
