import cors from 'cors';
import express from 'express';
import { config } from './config';
import { pool } from './db';
import { errorHandler } from './middleware/error-handler';
import { ordersRouter } from './routes/orders';
import { productsRouter } from './routes/products';

export function createApp() {
  const app = express();

  app.use(cors({ origin: config.corsOrigins }));
  app.use(express.json());

  // Проверка живости сервера и подключения к БД (пригодится для Docker healthcheck)
  app.get('/api/health', async (_req, res) => {
    try {
      await pool.query('SELECT 1');
      res.json({ status: 'ok' });
    } catch {
      res.status(503).json({ status: 'db_unavailable' });
    }
  });

  app.use('/api/orders', ordersRouter);
  app.use('/api/products', productsRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
  app.use(errorHandler);

  return app;
}
