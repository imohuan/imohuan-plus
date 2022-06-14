import { DataParser, JsonParser } from "./core/parser";
import { BrowserParser } from "./dom/browser";
export * from "./core/parser";

export function getParser<T>(data: any, global: T) {
  try {
    return new JsonParser<T>(JSON.parse(data), global);
  } catch {
    return new DataParser<T>(new BrowserParser(data), global);
  }
}
