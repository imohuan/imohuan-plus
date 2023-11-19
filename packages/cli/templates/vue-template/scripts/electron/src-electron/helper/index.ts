import { get, set } from "lodash-es";

import { GLOBAL } from "../typings";

export function getGLOBAL(): GLOBAL;
export function getGLOBAL<K extends keyof GLOBAL>(name?: K): GLOBAL[K];
export function getGLOBAL<K extends keyof GLOBAL>(name?: K): GLOBAL | GLOBAL[K] {
  if (name) return get(global, name, null) as GLOBAL[K];
  return global as any as GLOBAL;
}

export function setGLOBAL<K extends keyof GLOBAL>(name: K, value: GLOBAL[K]): void {
  set(global, name, value);
}
