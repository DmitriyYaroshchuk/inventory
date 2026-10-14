import { Router } from 'express';
import { getProducts, getProductTypes } from '../services/products.service';

export const productsRouter = Router();

// GET /api/products/types — список типов для селекта-фильтра
productsRouter.get('/types', async (_req, res) => {
  res.json(await getProductTypes());
});

// GET /api/products?type=Monitors — все продукты, опционально по типу
productsRouter.get('/', async (req, res) => {
  const type = typeof req.query.type === 'string' ? req.query.type.trim() : '';
  res.json(await getProducts({ type: type || undefined }));
});
