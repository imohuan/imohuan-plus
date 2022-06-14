declare interface Parser {
  attr(prop: string): string | null;
  html(): string | null;
  text(): string | null;
  first(): Parser | null;
  last(): Parser | null;
  queryRoot(): Parser;
  querySelector(selector: string): Parser | null;
  querySelectorAll(selector: string): ParserArray;
}

declare interface ParserArray {
  first(): Parser | null;
  last(): Parser | null;
  queryRoot(): Parser;
  each(callback: (value: Parser, index: number, all: Parser[]) => void): void;
}

declare interface QueryChar {
  /** 获取 `querySelectorAll` (默认: `@`) */
  all: string;
  /** 获取 `document.documentElement.querySelector` (默认: `!`)*/
  root: string;
  /** 获取 循环根部 (默认: `_`)*/
  current: string;
  /** 模板替换变量 (默认: `/\{([_a-zA-Z0-9]+)}/g`)*/
  var: RegExp;
  /** 不进行获取, 直接返回 * 后面的内容 (默认: `*`)*/
  no: string;
}

declare type QueryReplace = [RegExp, (value: string, ...args: string[]) => any, string];

declare type EmitterEvent = {
  files: {
    key: string;
    value: any;
    keys: string[];
    filterKeys: string[];
    data: any;
  };
};
