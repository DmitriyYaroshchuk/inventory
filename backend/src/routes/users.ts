import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { listUsers } from '../services/users.service';

export const usersRouter = Router();

usersRouter.get('/', requireAuth, async (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  res.json(await listUsers(q || undefined));
});
