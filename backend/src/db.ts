import mysql from 'mysql2/promise';
import { config } from './config';

const { sslCa, ...connection } = config.db;

export const pool = mysql.createPool({
  ...connection,
  // облачная MySQL (Aiven) принимает только шифрованные подключения
  ssl: sslCa ? { ca: sslCa } : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  // DATETIME хранится без часового пояса — читаем как UTC, наружу отдаём ISO-строки
  timezone: 'Z',
  // DECIMAL приходит числом, а не строкой
  decimalNumbers: true,
});