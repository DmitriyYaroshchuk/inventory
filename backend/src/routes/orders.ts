import { Router } from 'express';
import { deleteOrder, getOrder, listOrders } from '../services/orders.service';
import { parseId } from '../utils';

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

// DELETE /api/orders/:id — удалить приход вместе с продуктами
ordersRouter.delete('/:id', async (req, res) => {
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
