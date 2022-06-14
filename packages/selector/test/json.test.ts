import { beforeEach, describe, expect, it } from "vitest";

import { NodeParser } from "../src/dom/node";
import { JsonParser } from "../src/index";

const data = {
  hello: "world",
  pageFor: "page",
  count: 3,
  arr: [1, 2, 3]
};

const json = {
  ...data,
  page: 1,
  size: 10,
  list: [
    { title: "title1", url: "https://22222", tag: [1, 2, 3, 4, 5] },
    { title: "title2", url: "https://33333", tag: [11, 22, 33, 44, 55] }
  ]
};

describe("Parser", () => {
  it("Json Parser", async () => {
    const parser = new JsonParser(json, {});
    expect(parser.query({ value: "pageFor[0]|hello" })).toBe("p");
    expect(parser.query({ value: "xxxx|hello" })).toBe("world");
    expect(parser.query({ value: "xxx| xxxx xc x x| xxx|hello" })).toBe("world");
    expect(parser.query({ value: "count" })).toBe(3);
    expect(parser.query({ value: "*{hello}_{pageFor}" })).toBe("world_page");
    expect(parser.query({ value: "{pageFor}" })).toBe(1);

    const result1 = parser.queryParent("list", [
      { name: "title", value: "title" },
      { name: "url", value: "urlx|tag" }
    ]);
    expect(result1).toEqual([
      { title: "title1", url: [1, 2, 3, 4, 5] },
      { title: "title2", url: [11, 22, 33, 44, 55] }
    ]);

    const result2 = parser.queryParent("list", [
      { name: "title", value: "title" },
      { name: "url", value: "tag" }
    ]);
    expect(result2).toEqual([
      { title: "title1", url: [1, 2, 3, 4, 5] },
      { title: "title2", url: [11, 22, 33, 44, 55] }
    ]);

    const result3 = parser.queryData([
      { name: "page", value: "page" },
      { name: "size", value: "size" },
      {
        name: "lists",
        parent: "list",
        children: [
          { name: "t", value: "title" },
          { name: "URL", value: "url" },
          { name: "global_page", value: "!xx|!page" },
          { name: "global_size", value: "!size" }
        ]
      }
    ]);
    console.log(result3);

    // expect(result2).toEqual([
    //   { title: "title1", url: [1, 2, 3, 4, 5] },
    //   { title: "title2", url: [11, 22, 33, 44, 55] }
    // ]);
  });
});
