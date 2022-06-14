import { difference, get, isArray, isObject } from "lodash-es";
import mitt from "mitt";

import { isNullOrEmpty } from "../helper";
import { emitter, returnDefault } from "./config";
import {
  query,
  queryJson,
  queryJsonKeys as _queryJsonKeys,
  QueryJsonOption,
  queryKeys as _queryKeys,
  QueryOption
} from "./query";

export type ParserOption<T> = {
  cls?: string | string[];
  name?: string;
  parent?: any;
  children?: ParserOption<T>[];
  [key: string]: any;
} & Partial<Omit<QueryOption<T>, "cls">>;

const keys = ["name", "parent", "children"];
export const queryKeys = keys.concat(_queryKeys);
export const queryJsonKeys = keys.concat(_queryJsonKeys);

export function emitFiles(key: string, data: any, mode: "html" | "json", instance: any = null) {
  const keys = Object.keys(data);
  const filterKeys = difference(data, mode === "html" ? queryKeys : queryJsonKeys);
  const sendData = { key, value: get(data, key, false), keys, filterKeys, data };
  emitter.emit("files", sendData);
  instance?.emitter.emit("files", sendData);
}

export type ParserJsonOption<T> = {
  value?: string | string[];
  name?: string;
  parent?: any;
  children?: ParserOption<T>[];
  [key: string]: any;
} & Partial<Omit<QueryJsonOption<T>, "value">>;

export class DataParser<T> {
  /** 自定义 processing 中第二个参数 */
  global: T;
  /** List获取数据后配合 global 提供全局使用 */
  private current: any;
  /** Parser HTML解析器 */
  private parser: Parser;
  private emitter = mitt<EmitterEvent>();

  constructor(parser: Parser, global: T) {
    this.global = global;
    this.current = {};
    this.parser = parser;
  }

  public on<Key extends keyof EmitterEvent>(
    key: Key,
    callback: (event: EmitterEvent[Key]) => void
  ) {
    this.emitter.on(key, callback);
  }

  public off<Key extends keyof EmitterEvent>(
    key: Key,
    callback: (event: EmitterEvent[Key]) => void
  ) {
    this.emitter.off(key, callback);
  }

  query(dataParser: ParserOption<T>, parser: Parser = this.parser): any {
    const cls = dataParser.cls;
    const selectorList: string[] = (isArray(cls) ? cls : String(cls).split("|")).filter((f) => f);
    const selector = selectorList.shift();
    if (!selector) return returnDefault;
    const result = query(
      parser,
      { ...dataParser, cls: selector },
      { ...this.global, ...this.current }
    );
    return isNullOrEmpty(result) && selectorList.length > 0
      ? this.query({ ...dataParser, cls: selectorList }, parser)
      : result;
  }

  queryParent(
    parent: string,
    childrenOption: ParserOption<T>[] = [],
    parser: Parser = this.parser
  ) {
    const result: any[] = [];
    const parentParser = parser.querySelectorAll(parent);
    if (!parentParser) return returnDefault;
    parentParser.each((_parser) => {
      const item: any = {};
      childrenOption.forEach((childOption): any => {
        const { name, cls, parent, children, ...option } = childOption;
        if (isNullOrEmpty(name) || (isNullOrEmpty(cls) && isNullOrEmpty(parent))) {
          return returnDefault;
        }
        if (parent && isArray(children)) {
          item[name!] = this.queryParent(parent, children, _parser);
        } else if (cls) {
          item[name!] = this.query({ ...option, cls }, _parser);
          emitFiles(name!, childOption, "html", this);
        }
      });
      result.push(item);
    });
    return result;
  }

  /** HTML 配置 获取 */
  queryList(dataParsers: ParserOption<T>[]): any {
    const result: any = {};
    this.current = null;
    dataParsers.forEach((dataParser): any => {
      const { name, parent, children } = dataParser;
      if (isNullOrEmpty(name)) return false;
      if (parent && isArray(children)) {
        result[name!] = this.queryParent(parent, children);
      } else {
        result[name!] = this.query(dataParser);
        emitFiles(name!, dataParser, "html", this);
      }
      this.current = result;
    });
    return result;
  }

  /** 通用配置 获取数据 */
  queryData(dataParsers: ParserOption<T>[]): any {
    return this.queryList(dataParsers);
  }
}

export class JsonParser<T> {
  /** 自定义 processing 中第二个参数 */
  global: T;
  /** 全局JSON数据  */
  private content: any;
  /** List获取数据后配合 global 提供全局使用 */
  private current: any;
  private emitter = mitt<EmitterEvent>();

  constructor(content: any, global: T) {
    this.current = {};
    if (isObject(content)) {
      this.content = content;
    } else {
      try {
        this.content = JSON.parse(content);
      } catch {
        this.content = content;
      }
    }
    this.global = { ...global, ...this.content };
  }

  public on<Key extends keyof EmitterEvent>(
    key: Key,
    callback: (event: EmitterEvent[Key]) => void
  ) {
    this.emitter.on(key, callback);
  }

  public off<Key extends keyof EmitterEvent>(
    key: Key,
    callback: (event: EmitterEvent[Key]) => void
  ) {
    this.emitter.off(key, callback);
  }

  query(dataParser: ParserJsonOption<T>, data: any = this.content): any {
    const value = dataParser.value;
    const keys: string[] = (isArray(value) ? value : String(value).split("|")).filter((f) => f);
    const key = keys.shift();
    if (!key) return returnDefault;
    const result = queryJson(
      { global: this.content, current: data },
      { ...dataParser, value: key },
      { ...this.global, ...this.current }
    );

    return isNullOrEmpty(result) && keys.length > 0
      ? this.query({ ...dataParser, value: keys }, data)
      : result;
  }

  queryParent(
    parent: string,
    childrenOption: ParserJsonOption<T>[] = [],
    current: any = this.content
  ) {
    const result: any[] = [];
    const values: any[] = get(current, parent, false);
    if (!values || !isArray(values)) return returnDefault;
    values.forEach((_value) => {
      const item: any = {};
      childrenOption.forEach((childOption): any => {
        const { name, value, parent, children, ...option } = childOption;
        if (isNullOrEmpty(name) || (isNullOrEmpty(value) && isNullOrEmpty(parent))) {
          return returnDefault;
        }
        if (parent && isArray(children)) {
          item[name!] = this.queryParent(parent, children, _value);
        } else if (value) {
          item[name!] = this.query({ ...option, value }, _value);
          emitFiles(name!, childOption, "json", this);
        }
      });
      result.push(item);
    });
    return result;
  }

  queryList(dataParsers: ParserJsonOption<T>[]): any {
    const result: any = {};
    this.current = null;
    dataParsers.forEach((dataParser): any => {
      const { name, parent, children } = dataParser;
      if (isNullOrEmpty(name)) return false;
      if (parent && isArray(children)) {
        result[name!] = this.queryParent(parent, children);
      } else {
        result[name!] = this.query(dataParser);
        emitFiles(name!, dataParser, "json", this);
      }
      this.current = result;
    });
    return result;
  }

  /** 通用配置 获取数据 */
  queryData(dataParsers: ParserJsonOption<T>[]): any {
    return this.queryList(dataParsers);
  }
}
