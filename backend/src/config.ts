import 'dotenv/config';

const toNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return value !== undefined && Number.isFinite(parsed) ? parsed : fallback;
};

export const config = {
  port: toNumber(process.env.PORT, 4000),
  corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:3000,http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
  jwtExpiresIn: '7d' as const,
  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: toNumber(process.env.DB_PORT, 3306),
    user: process.env.DB_USER ?? 'inventory',
    password: process.env.DB_PASSWORD ?? 'inventory',
    database: process.env.DB_NAME ?? 'inventory',
    // CA-сертификат облачной MySQL; если не задан — подключение без SSL (локальный Docker).
    // В переменной окружения переносы строк могут прийти как "\n" — превращаем их обратно
    sslCa: process.env.DB_SSL_CA?.replace(/\\n/g, '\n'),
  },
};
