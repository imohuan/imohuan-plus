import { DataParser, JsonParser } from "./core/parser";
import { NodeParser } from "./dom/node";

export * from "./core/parser";

export function getParser<T>(data: any, global: T) {
  try {
    return new JsonParser<T>(JSON.parse(data), global);
  } catch {
    return new DataParser<T>(new NodeParser(data), global);
  }
}
