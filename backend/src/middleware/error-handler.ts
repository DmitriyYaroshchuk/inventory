import type { ErrorRequestHandler } from 'express';

// Express 5 сам передаёт сюда ошибки из async-обработчиков
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};
