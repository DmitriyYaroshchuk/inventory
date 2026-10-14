import mysql from 'mysql2/promise';
import { config } from './config';

export const pool = mysql.createPool({
  ...config.db,
  waitForConnections: true,
  connectionLimit: 10,
  // DATETIME хранится без часового пояса — читаем как UTC, наружу отдаём ISO-строки
  timezone: 'Z',
  // DECIMAL приходит числом, а не строкой
  decimalNumbers: true,
});
