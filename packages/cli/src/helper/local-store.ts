import { set, get } from "lodash";
import { JSONFileSync, LowSync } from "lowdb";

export class Store<T> {
  db: LowSync<any>;

  constructor(path: string, defaults: T) {
    const adapter = new JSONFileSync<T>(path);
    this.db = new LowSync<T>(adapter);
    this.db.read();
    this.init(defaults);
  }

  private init(defaults: T) {
    if (!this.db.data) {
      this.db.data! = defaults;
      this.db.write();
    }
  }

  set<K extends keyof T>(key: K, value: T[K]) {
    this.db.read();
    set(this.db.data! as any, key, value);
    this.db.write();
  }

  get<K extends keyof T>(key?: K, defaults: T[K] | null = null): T[K] {
    this.db.read();
    return (key ? get(this.db.data, key, null) : this.db.data) || defaults;
  }
}
