import prettier from "prettier/esm/standalone.mjs";
import parserBabel from "prettier/esm/parser-babel.mjs";
import parserPostCss from "prettier/esm/parser-postcss.mjs";
import parserYaml from "prettier/esm/parser-yaml.mjs";
import parserEspree from "prettier/esm/parser-espree.mjs";
import parserMarkdown from "prettier/esm/parser-markdown.mjs";
import parserTypescript from "prettier/esm/parser-typescript.mjs";
import parserHtml from "prettier/esm/parser-html.mjs";
import { defaultsDeep } from "lodash-es";

export type ParserType =
  | "yaml"
  | "css"
  | "less"
  | "scss"
  | "html"
  | "json"
  | "json-stringify"
  | "babel"
  | "babel-ts"
  | "typescript"
  | "markdown";

export const defaultOption = {
  // 一行最多 xx 字符
  printWidth: 100,
  // 使用 2 个空格缩进
  tabWidth: 2,
  // 不使用缩进符，而使用空格
  useTabs: false,
  // 行尾需要有分号
  semi: true,
  // 使用单引号
  singleQuote: false,
  // 末尾不需要逗号
  trailingComma: "none",
  // 大括号内的首尾需要空格
  bracketSpacing: true,
  // 箭头函数，只有一个参数的时候，也需要括号
  arrowParens: "always",
  // 每个文件格式化的范围是文件的全部内容
  rangeStart: 0,
  rangeEnd: Infinity,
  // 不需要写文件开头的 @prettier
  requirePragma: false,
  // 不需要自动在文件开头插入 @prettier
  insertPragma: false,
  // 使用默认的折行标准
  proseWrap: "preserve",
  // 根据显示样式决定 html 要不要折行
  htmlWhitespaceSensitivity: "css"
};

export function format(code: string, parser: ParserType, options: any = {}): string {
  const parsers = [
    "yaml",
    "css",
    "less",
    "scss",
    "html",
    "json",
    "json-stringify",
    "babel",
    "babel-ts",
    "typescript",
    "markdown"
  ];

  // 如果不是支持的语言直接返回
  if (!parsers.includes(parser)) {
    return code;
  }

  return formatBase(
    code,
    defaultsDeep(
      {
        parser,
        plugins: [
          parserBabel,
          parserPostCss,
          parserYaml,
          parserEspree,
          parserMarkdown,
          parserTypescript,
          parserHtml
        ]
      },
      defaultOption,
      options
    )
  );
}

export function formatBase(code: string, options: any = {}) {
  try {
    return prettier.format(code, {
      plugins: [
        parserBabel,
        parserPostCss,
        parserYaml,
        parserEspree,
        parserMarkdown,
        parserTypescript,
        parserHtml
      ],
      ...defaultOption,
      ...options
    });
  } catch {
    return code;
  }
}
