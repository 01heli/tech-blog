/* eslint-disable @typescript-eslint/no-explicit-any */
import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import { readFileSync } from 'fs';
import path from 'path';

/** boss_ai 项目的 SQLite 数据库路径，可通过环境变量 BOSS_DB_PATH 覆盖 */
const DB_PATH =
  process.env.BOSS_DB_PATH ||
  path.resolve('F:/claude_project/boss_ai/data/boss_jobs.db');

let _db: SqlJsDatabase | null = null;
let _initPromise: Promise<SqlJsDatabase> | null = null;

async function initDb(): Promise<SqlJsDatabase> {
  const SQL = await initSqlJs();
  const buffer = readFileSync(DB_PATH);
  return new SQL.Database(buffer);
}

/**
 * 获取 boss_ai SQLite 数据库的单例连接。
 * sql.js 将整个 DB 加载到内存（~2MB），查询极快。
 */
export async function getDb(): Promise<SqlJsDatabase> {
  if (_db) return _db;
  if (!_initPromise) {
    _initPromise = initDb();
  }
  _db = await _initPromise;
  return _db;
}

/**
 * 将 better-sqlite3 风格的 ? 占位符查询转换为 sql.js 的纯 SQL 字符串。
 * 注意：仅适用于内部可信数据，不做防注入处理。
 */
export function sqlFormat(
  query: string,
  params: (string | number | null | undefined)[] = []
): string {
  let i = 0;
  return query.replace(/\?/g, () => {
    const val = params[i++];
    if (val === undefined || val === null) return 'NULL';
    if (typeof val === 'number') return String(val);
    return `'${String(val).replace(/'/g, "''")}'`;
  });
}

/** 执行查询并返回所有行（等同于 better-sqlite3 .all()） */
export function execAll(
  db: SqlJsDatabase,
  sql: string,
  params: (string | number | null | undefined)[] = []
): any[] {
  const formatted = sqlFormat(sql, params);
  const results = db.exec(formatted);
  if (!results.length) return [];
  const [table] = results;
  return table.values.map((row) => {
    const obj: any = {};
    table.columns.forEach((col, j) => {
      obj[col] = row[j];
    });
    return obj;
  });
}

/** 执行查询并返回第一行（等同于 better-sqlite3 .get()） */
export function execOne(
  db: SqlJsDatabase,
  sql: string,
  params: (string | number | null | undefined)[] = []
): any | null {
  const formatted = sqlFormat(sql, params);
  const results = db.exec(formatted);
  if (!results.length || !results[0].values.length) return null;
  const table = results[0];
  const row = table.values[0];
  const obj: any = {};
  table.columns.forEach((col, j) => {
    obj[col] = row[j];
  });
  return obj;
}
