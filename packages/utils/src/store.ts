import { resolve } from "path";
import { knex, Knex } from "knex";
import { removeSync, ensureDirSync } from "fs-extra";

export * from "knex";

export type ColumnType =
  | "string"
  | "integer"
  | "tinyint"
  | "smallint"
  | "mediumint"
  | "bigint"
  | "bigInteger"
  | "float"
  | "double"
  | "decimal"
  | "date"
  | "dateTime"
  | "time"
  | "timestamp"
  | "boolean"
  | "text";

export interface TableColumn {
  name: string;
  type?: ColumnType;
  unique?: boolean;
  increments?: boolean;
}

export interface PageOption {
  name: string;
  page: number;
  size: number;
  where: any;
  whereRaw: string;
  order: string;
}

export class SqliteStore<T> {
  public sql: Knex;
  public filePath: string;
  private tableColumns: TableColumn[];

  constructor(dirPath: string, name: string) {
    ensureDirSync(dirPath);
    this.filePath = resolve(dirPath, `${name}.db`);

    this.sql = knex({
      client: "sqlite3",
      useNullAsDefault: true,
      connection: { filename: this.filePath }
    });

    this.tableColumns = [];
  }

  public async initTable(name: string, tableColumns: TableColumn[]) {
    this.tableColumns = tableColumns;
    if (!(await this.sql.schema.hasTable(name))) {
      await this.sql.schema.createTable(name, (table: any) => {
        tableColumns.forEach((item) => {
          const { type, name, unique, increments } = item;
          if (increments) table.increments(name);
          else table[type || "string"](name);
          if (unique) table.unique([name]);
        });
      });
    }
  }

  public async hasTable(name: string) {
    return await this.sql.schema.hasTable(name);
  }

  public async insert(name: string, data: Partial<T>) {
    try {
      return await this.sql(name).insert(data);
    } catch (err) {
      return null;
    }
  }

  public async batchInsert(name: string, dataList: Partial<T>[], chunkSize = 100) {
    return new Promise((resolve) => {
      this.sql
        .batchInsert(name, dataList as any, chunkSize)
        .then((res: any) => {
          resolve(res);
        })
        .catch((err: any) => {
          console.log("BatchInsert Error: ", err);
        });
    });
  }

  public async select(name: string, select: Partial<T>, show: string[] = []) {
    if (show.length === 0) show = this.tableColumns.map((item) => item.name);
    return await this.sql(name)
      .where(select)
      .select(...show);
  }

  public async count(name: string) {
    return (await this.sql(name).count("*"))[0]["count(*)"];
  }

  public async page(option: PageOption) {
    const { name, page, size, where, order } = option;
    const start = size * (page - 1);
    const sql = await this.sql(name)
      .where(where)
      .select()
      .orderByRaw(order)
      .limit(size)
      .offset(start)
      .toQuery();
    const count = (await this.sql(name).count("*"))[0]["count(*)"];
    const result = await this.sql.raw(sql);
    return { page, size, count, sql, result };
  }

  public async remove(name: string, select: Partial<T>) {
    return await this.sql(name).where(select).del();
  }

  public async removeId(name: string, id: any) {
    return await this.sql(name).where({ id }).del();
  }

  public async update(name: string, select: Partial<T>, data: Partial<T>) {
    return await this.sql(name).where(select).update(data);
  }

  public async updateId(name: string, id: any, data: Partial<T>) {
    return await this.sql(name).where({ id }).update(data);
  }

  /**
   * 根据unique字段去除数据库中重复数据
   * @param name 表名
   * @param unique 判断是否重复的字段
   * @returns true
   */
  public async removeRepetition(name: string, unique: string = "name") {
    const sql = `DELETE FROM \`${name}\` WHERE \`${name}\`.rowid NOT IN ( SELECT MAX(\`${name}\`.rowid) FROM \`${name}\` GROUP BY \`${unique}\`)`;
    return await this.sql.raw(sql);
  }

  public async raw(sql: string) {
    return await this.sql.raw(sql);
  }

  public close() {
    return new Promise((res) => {
      setTimeout(async () => {
        await this.sql.destroy();
        res(true);
      }, 1000);
    });
  }

  public async destroy() {
    await this.close();
    await removeSync(this.filePath);
  }
}
