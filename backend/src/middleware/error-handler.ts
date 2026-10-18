import type { ErrorRequestHandler } from 'express';

// Express 5 сам передаёт сюда ошибки из async-обработчиков
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ error: 'Invalid JSON' });
    return;
  }
  res.status(500).json({ error: 'Internal server error' });
};
