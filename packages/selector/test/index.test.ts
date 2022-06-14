import { beforeEach, describe, expect, it } from "vitest";

import { DataParser, getParser } from "../src/index";

describe("DataParser", () => {
  it("new DataParser", async () => {
    const html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
        <div class="head">
          <span>经济xxx</span>
        </div>
    
        <ul>
          <li id="xxx">
            <div class="title">       标题1          </div>
            <div class="description">描述1</div>
            <div class="tags"><span class="tag">1</span> <span class="tag">2</span></div>
          </li>
          <li>
            <div class="title">标题2      </div>
            <div class="description">描述2</div>
            <div class="tags"><span class="tag">1</span><span class="tag">2</span></div>
          </li>
          <li>
            <div class="title">标题3</div>
            <div class="description">描述3</div>
            <div class="tags"><span class="tag">1</span><span class="tag">2</span></div>
          </li>
        </ul>
      </body>
    </html>
    `;
    // const parser = new DataParser<any>(html, {});
    const parser = getParser<any>(html, {});

    expect(parser.query({ cls: ".head::text", rules: ["trim"] })).toBe("经济xxx");
    expect(parser.query({ cls: ".what::text|.dddd::text|.head::text", rules: ["trim"] })).toBe(
      "经济xxx"
    );

    const result1 = parser.queryParent("ul li", [
      { name: "title", cls: ".title::text", rules: ["trim"] },
      { name: "description", cls: ".description::text", rules: ["trim"] },
      {
        name: "tags",
        parent: ".tag",
        children: [{ name: "tag", cls: "_::text" }]
      }
    ]);
    expect(result1).toEqual([
      { title: "标题1", description: "描述1", tags: [{ tag: "1" }, { tag: "2" }] },
      { title: "标题2", description: "描述2", tags: [{ tag: "1" }, { tag: "2" }] },
      { title: "标题3", description: "描述3", tags: [{ tag: "1" }, { tag: "2" }] }
    ]);

    const result2 = parser.queryParent("ul li .title", [
      { name: "content", cls: "_::text", rules: ["trim"] }
    ]);
    expect(result2).toEqual([{ content: "标题1" }, { content: "标题2" }, { content: "标题3" }]);

    const result3 = parser.queryData([
      { name: "head", cls: ".head::text", rules: ["trim"] },
      {
        name: "list",
        parent: "ul li",
        children: [
          { name: "title", cls: ".title::text", rules: ["trim"] },
          { name: "description", cls: ".description::text", rules: ["trim"] },
          { name: "tags", parent: ".tag", children: [{ name: "tag", cls: "_::text" }] }
        ]
      }
    ]);
    expect(result3).toEqual({
      head: "经济xxx",
      list: [
        { title: "标题1", description: "描述1", tags: [{ tag: "1" }, { tag: "2" }] },
        { title: "标题2", description: "描述2", tags: [{ tag: "1" }, { tag: "2" }] },
        { title: "标题3", description: "描述3", tags: [{ tag: "1" }, { tag: "2" }] }
      ]
    });

    const result4 = parser.queryData([
      {
        name: "list",
        parent: "ul li",
        children: [{ name: "title", cls: "!.head::text", rules: ["trim"] }]
      }
    ]);
    console.log("result4", result4);
  });
});
