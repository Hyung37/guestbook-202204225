import { getSql } from "./db";

// 화면에 전달하는 Entry. 비밀번호 해시는 절대 포함하지 않는다.
export type Entry = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
  updatedAt: string | null;
};

type EntryRow = {
  id: string | number;
  name: string;
  message: string;
  created_at: Date | string;
  updated_at: Date | string | null;
};

function toEntry(row: EntryRow): Entry {
  return {
    id: String(row.id),
    name: row.name,
    message: row.message,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : null,
  };
}

export async function listEntries(): Promise<Entry[]> {
  const sql = getSql();
  const rows = (await sql.query(
    `SELECT id, name, message, created_at, updated_at
       FROM entries
      ORDER BY created_at DESC, id DESC`,
  )) as EntryRow[];
  return rows.map(toEntry);
}

export async function insertEntry(input: {
  name: string;
  message: string;
  passwordHash: string;
}): Promise<void> {
  const sql = getSql();
  await sql.query(
    `INSERT INTO entries (name, message, password_hash) VALUES ($1, $2, $3)`,
    [input.name, input.message, input.passwordHash],
  );
}

export async function getPasswordHash(id: string): Promise<string | null> {
  const sql = getSql();
  const rows = (await sql.query(
    `SELECT password_hash FROM entries WHERE id = $1`,
    [id],
  )) as { password_hash: string }[];
  return rows[0]?.password_hash ?? null;
}

// 수정된 행이 있으면 true, 그 사이 삭제되어 없으면 false
export async function updateMessage(id: string, message: string): Promise<boolean> {
  const sql = getSql();
  const rows = await sql.query(
    `UPDATE entries SET message = $2, updated_at = now() WHERE id = $1 RETURNING id`,
    [id, message],
  );
  return rows.length > 0;
}

// 삭제된 행이 있으면 true, 그 사이 이미 지워졌으면 false
export async function removeEntry(id: string): Promise<boolean> {
  const sql = getSql();
  const rows = await sql.query(`DELETE FROM entries WHERE id = $1 RETURNING id`, [id]);
  return rows.length > 0;
}
