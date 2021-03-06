import { beforeEach, describe, expect, it } from "vitest";

import { query, queryJson } from "../src/core/query";
import { NodeParser } from "../src/dom/node";

const data = {
  hello: "world",
  pageFor: "page",
  count: 3,
  arr: [1, 2, 3]
};

describe("query", () => {
  it("Json Query", async () => {
    const jsonData = {
      page: 1,
      size: 10,
      list: [
        { title: "title1", url: "https://22222", tag: [1, 2, 3, 4, 5] },
        { title: "title2", url: "https://33333", tag: [11, 22, 33, 44, 55] }
      ]
    };

    const json = { global: jsonData, current: jsonData };
    expect(queryJson(json, { value: "page" }, {})).toBe(1);
    expect(queryJson(json, { value: "size" }, {})).toBe(10);
    expect(queryJson(json, { value: "list[0].title" }, {})).toBe("title1");
    expect(queryJson(json, { parent: "list", value: "title" }, {})).toEqual(["title1", "title2"]);

    expect(queryJson(json, { parent: "list", value: "tag" }, {})).toEqual([
      [1, 2, 3, 4, 5],
      [11, 22, 33, 44, 55]
    ]);

    expect(queryJson(json, { parent: "list", value: "!page" }, {})).toEqual([1, 1]);
    expect(queryJson(json, { parent: "list", value: "!size" }, {})).toEqual([10, 10]);
    expect(queryJson(json, { value: "{pageFor}" }, data)).toBe(1);
    expect(queryJson(json, { value: "*123", rules: ["trim"] }, {})).toEqual("123");
    expect(queryJson(json, { value: "*456", rules: ["trim"] }, {})).toEqual("456");
    expect(queryJson(json, { value: "*{count}", rules: ["trim"] }, data)).toEqual("3");
    expect(queryJson(json, { value: "*{hello}", rules: ["trim"] }, data)).toEqual("world");
    expect(queryJson(json, { value: "*{hello}_{count}", rules: ["trim"] }, data)).toEqual(
      "world_3"
    );
    expect(queryJson(json, { value: "*{arr}", rules: ["trim"] }, data)).toEqual("1,2,3");
  });

  it("Query", async () => {
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
          <span>??????xxx</span>
        </div>
    
        <ul>
          <li id="xxx">
            <div class="title">       ??????1          </div>
            <div class="description">??????1</div>
            <div class="tags"><span class="tag">1</span> <span class="tag">2</span></div>
          </li>
          <li>
            <div class="title">??????2      </div>
            <div class="description">??????2</div>
            <div class="tags"><span class="tag">1</span><span class="tag">2</span></div>
          </li>
          <li>
            <div class="title">??????3</div>
            <div class="description">??????3</div>
            <div class="tags"><span class="tag">1</span><span class="tag">2</span></div>
          </li>
        </ul>
      </body>
    </html>
    `;

    const parser = new NodeParser(html);
    expect(query(parser, { cls: ".head::text", rules: ["trim"] }, {})).toBe("??????xxx");
    expect(query(parser, { cls: ".head::html", rules: ["trim"] }, {})).toBe("<span>??????xxx</span>");
    expect(query(parser, { cls: "ul li .title::text", rules: ["trim"] }, {})).toBe("??????1");
    expect(query(parser, { cls: "@ul li .title::text", rules: ["trim"] }, {})).toEqual([
      "??????1",
      "??????2",
      "??????3"
    ]);

    expect(query(parser, { parent: "ul li", cls: "_::attr(id)", rules: ["trim"] }, {})).toEqual([
      "xxx",
      null,
      null
    ]);

    expect(query(parser, { parent: "ul li", cls: ".title::text", rules: ["trim"] }, {})).toEqual([
      "??????1",
      "??????2",
      "??????3"
    ]);

    expect(query(parser, { parent: "ul li", cls: "!.head::text", rules: ["trim"] }, {})).toEqual([
      "??????xxx",
      "??????xxx",
      "??????xxx"
    ]);

    expect(
      query(parser, { parent: "ul li", cls: "@.tags .tag::text", rules: ["trim"] }, {})
    ).toEqual([
      ["1", "2"],
      ["1", "2"],
      ["1", "2"]
    ]);

    expect(query(parser, { cls: "*123", rules: ["trim"] }, {})).toEqual("123");
    expect(query(parser, { cls: "*456", rules: ["trim"] }, {})).toEqual("456");
    expect(query(parser, { cls: "*{count}", rules: ["trim"] }, data)).toEqual("3");
    expect(query(parser, { cls: "*{hello}", rules: ["trim"] }, data)).toEqual("world");
    expect(query(parser, { cls: "*{hello}_{count}", rules: ["trim"] }, data)).toEqual("world_3");
    expect(query(parser, { cls: "*{arr}", rules: ["trim"] }, data)).toEqual("1,2,3");
    expect(query(parser, { cls: `@ul li:not([id="xxx"]) .title::text` }, data)).toEqual([
      "??????2      ",
      "??????3"
    ]);
    expect(query(parser, { cls: `@ul li:not(#xxx) .title::text` }, data)).toEqual([
      "??????2      ",
      "??????3"
    ]);

    //
    console.log(query(parser, { cls: `body :only-of-type::text` }, data));
  });
});
