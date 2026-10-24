import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { config } from '../config';
import { pool } from '../db';
import type { User } from '../types';

interface UserRow extends RowDataPacket {
    id: number;
    name: string;
    email: string;
    password_hash: string;
}

type TokenPayload = {
    userId: number;
};

const toUser = (row: UserRow): User => {
    return {
        id: row.id,
        name: row.name,
        email: row.email
    }
}

const findUserRowByEmail = async (email: string): Promise<UserRow | null> => {
    const [rows] = await pool.query<UserRow[]>('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] ?? null;
};

export const findUserById = async (id: number): Promise<User | null> => {
    const [rows] = await pool.query<UserRow[]>('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] ? toUser(rows[0]) : null;
};

export const registerUser = async (
    name: string,
    email: string,
    password: string,
): Promise<User | null> => {
    const existing = await findUserRowByEmail(email);
    if (existing) return null;

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.query<ResultSetHeader>(
        'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
        [name, email, passwordHash],
    );
    return { id: result.insertId, name, email };
};

export const loginUser = async (email: string, password: string): Promise<User | null> => {
    const row = await findUserRowByEmail(email);
    if (!row) return null;

    const isPasswordValid = await bcrypt.compare(password, row.password_hash);
    return isPasswordValid ? toUser(row) : null;
};

export const createToken = (user: User): string => {
    const payload: TokenPayload = { userId: user.id };
    return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
};

export const verifyToken = (token: string): number | null => {
    try {
        const payload = jwt.verify(token, config.jwtSecret) as TokenPayload;
        return payload.userId;
    } catch {
        return null;
    }
};