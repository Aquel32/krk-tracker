"use server";
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'kmk',
});

export async function Query(sql: string): Promise<any> {
  try {
    const [results] = await connection.query(sql);
    return results;
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function getConnection() {
  return connection;
}

export async function createColumnsIfDoesntExist(tableName: string, columns: string[]) {
  if (!columns || columns.length === 0) return;

  const [rows]: any = await connection.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?`,
    [tableName]
  );

  const existing = new Set(rows.map((r: any) => r.COLUMN_NAME));
  const missing = columns.filter((c) => !existing.has(c));

  if (missing.length === 0) return;

  for (const col of missing) {
    const safeCol = col.replace(/`/g, "");
    await connection.query(`ALTER TABLE \`${tableName}\` ADD COLUMN IF NOT EXISTS \`${safeCol}\` TEXT`);
  }
}