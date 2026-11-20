import type { RowDataPacket } from 'mysql2';
import { pool } from '../db';
import type { UserListItem } from '../types';

interface UserListRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  created_at: Date;
}

export const listUsers = async (search?: string): Promise<UserListItem[]> => {
  const where = search ? 'WHERE name LIKE ? OR email LIKE ?' : '';
  const params = search ? [`%${search}%`, `%${search}%`] : [];

  const [rows] = await pool.query<UserListRow[]>(
    `SELECT id, name, email, created_at FROM users ${where} ORDER BY created_at DESC, id DESC`,
    params,
  );

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.created_at.toISOString(),
  }));
};
