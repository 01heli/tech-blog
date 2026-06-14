import Database from 'better-sqlite3';
import path from 'path';

/** boss_ai 项目的 SQLite 数据库绝对路径 */
const DB_PATH = path.resolve('F:/claude_project/boss_ai/data/boss_jobs.db');

let _db: Database.Database | null = null;

/**
 * 获取 boss_ai SQLite 数据库的单例连接。
 * WAL 模式确保读写不互斥。
 */
export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH, { readonly: true });
    _db.pragma('journal_mode=WAL');
    _db.pragma('busy_timeout=5000');
  }
  return _db;
}
