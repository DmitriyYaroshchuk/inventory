import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProducts,
  getProductTypes,
  getProductGroups,
  type NewProduct,
} from '../services/products.service';
import { getOrder } from '../services/orders.service';
import { parseId } from '../utils';
import { requireAuth } from '../middleware/auth';

export const productsRouter = Router();

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const toText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const isPositiveInt = (value: unknown): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value > 0;

const isPrice = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0;

const isDate = (value: string) => DATE_PATTERN.test(value) && !Number.isNaN(Date.parse(value));

// Проверяет тело запроса; возвращает null, если данные неверные
const parseNewProduct = (body: unknown): NewProduct | null => {
  const data = (body ?? {}) as Record<string, unknown>;

  const title = toText(data.title);
  const type = toText(data.type);
  const specification = toText(data.specification);
  const guaranteeStart = toText(data.guaranteeStart);
  const guaranteeEnd = toText(data.guaranteeEnd);
  const { orderId, serialNumber, isNew, priceUsd, priceUah } = data;

  if (title.length < 2 || title.length > 255) return null;
  if (type.length < 1 || type.length > 100) return null;
  if (specification.length > 1000) return null;
  if (!isPositiveInt(orderId) || !isPositiveInt(serialNumber)) return null;
  if (typeof isNew !== 'boolean') return null;
  if (!isPrice(priceUsd) || !isPrice(priceUah)) return null;
  if (!isDate(guaranteeStart) || !isDate(guaranteeEnd)) return null;
  if (guaranteeStart > guaranteeEnd) return null;

  return {
    orderId,
    title,
    type,
    serialNumber,
    isNew,
    specification: specification || null,
    guaranteeStart,
    guaranteeEnd,
    priceUsd,
    priceUah,
  };
};

// GET /api/products/types — список типов для селекта-фильтра
productsRouter.get('/types', async (_req, res) => {
  res.json(await getProductTypes());
});

// GET /api/products/groups — продукты, сгруппированные по типу
productsRouter.get('/groups', async (_req, res) => {
  res.json(await getProductGroups());
});

// GET /api/products?type=Monitors&q=dell — продукты, опционально по типу и поиску
productsRouter.get('/', async (req, res) => {
  const type = typeof req.query.type === 'string' ? req.query.type.trim() : '';
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';

  res.json(
    await getProducts({
      type: type || undefined,
      search: q || undefined,
    }),
  );
});

// POST /api/products — добавить продукт в приход
productsRouter.post('/', requireAuth, async (req, res) => {
  const product = parseNewProduct(req.body);
  if (!product) {
    res.status(400).json({ error: 'Invalid product data' });
    return;
  }

  const order = await getOrder(product.orderId);
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  const id = await createProduct(product);
  res.status(201).json({ id });
});

// DELETE /api/products/:id — удалить продукт
productsRouter.delete('/:id', requireAuth, async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: 'Invalid product id' });
    return;
  }

  const deleted = await deleteProduct(id);
  if (!deleted) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  res.status(204).end();
});
