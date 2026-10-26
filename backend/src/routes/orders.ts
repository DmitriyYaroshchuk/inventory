import { Router } from 'express';
import { createOrder, deleteOrder, getOrder, listOrders } from '../services/orders.service';
import { parseId } from '../utils';
import { requireAuth } from '../middleware/auth';

export const ordersRouter = Router();

// GET /api/orders — список приходов (количество продуктов и суммы в валютах)
ordersRouter.get('/', async (_req, res) => {
  res.json(await listOrders());
});

// GET /api/orders/:id — приход вместе с продуктами
ordersRouter.get('/:id', async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: 'Invalid order id' });
    return;
  }

  const order = await getOrder(id);
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  res.json(order);
});

// POST /api/orders — создать приход
ordersRouter.post('/', requireAuth, async (req, res) => {
  const title = typeof req.body?.title === 'string' ? req.body.title.trim() : '';
  const description = typeof req.body?.description === 'string' ? req.body.description.trim() : '';

  if (title.length < 3 || title.length > 255) {
    res.status(400).json({ error: 'Title must be 3-255 characters' });
    return;
  }
  if (description.length > 1000) {
    res.status(400).json({ error: 'Description must be at most 1000 characters' });
    return;
  }

  const order = await createOrder(title, description || null);
  res.status(201).json(order);
});

// DELETE /api/orders/:id — удалить приход вместе с продуктами
ordersRouter.delete('/:id', requireAuth, async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: 'Invalid order id' });
    return;
  }

  const deleted = await deleteOrder(id);
  if (!deleted) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  res.status(204).end();
});
