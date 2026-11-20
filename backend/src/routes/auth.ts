import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  changePassword,
  createToken,
  findUserById,
  loginUser,
  registerUser,
  updateUserName,
} from '../services/auth.service';

export const authRouter = Router();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const readString = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

// POST /api/auth/register — регистрация, сразу выдаёт токен
authRouter.post('/register', async (req, res) => {
  const name = readString(req.body?.name);
  const email = readString(req.body?.email).toLowerCase();
  const password = typeof req.body?.password === 'string' ? req.body.password : '';

  if (name.length < 2 || name.length > 100) {
    res.status(400).json({ error: 'Name must be 2-100 characters' });
    return;
  }

  if (!EMAIL_PATTERN.test(email)) {
    res.status(400).json({ error: 'Invalid email' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters' });
    return;
  }

  const user = await registerUser(name, email, password);
  if (!user) {
    res.status(409).json({ error: 'Email is already registered' });
    return;
  }

  res.status(201).json({ token: createToken(user), user });
});

// POST /api/auth/login — вход, выдаёт токен
authRouter.post('/login', async (req, res) => {
  const email = readString(req.body?.email).toLowerCase();
  const password = typeof req.body?.password === 'string' ? req.body.password : '';

  const user = await loginUser(email, password);
  if (!user) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  res.json({ token: createToken(user), user });
});

// GET /api/auth/me — кто входит (по токену)
authRouter.get('/me', requireAuth, async (_req, res) => {
  const user = await findUserById(res.locals.userId);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  res.json(user);
});

// PATCH /api/auth/me — сменить имя текущего пользователя
authRouter.patch('/me', requireAuth, async (req, res) => {
  const name = readString(req.body?.name);

  if (name.length < 2 || name.length > 100) {
    res.status(400).json({ error: 'Name must be 2-100 characters' });
    return;
  }

  const user = await updateUserName(res.locals.userId, name);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  res.json(user);
});

// POST /api/auth/password — сменить пароль (нужен текущий)
authRouter.post('/password', requireAuth, async (req, res) => {
  const currentPassword =
    typeof req.body?.currentPassword === 'string' ? req.body.currentPassword : '';
  const newPassword = typeof req.body?.newPassword === 'string' ? req.body.newPassword : '';

  if (newPassword.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters' });
    return;
  }

  const isChanged = await changePassword(res.locals.userId, currentPassword, newPassword);
  if (!isChanged) {
    // 403, а не 401: пользователь вошёл, но текущий пароль неверный
    res.status(403).json({ error: 'Current password is incorrect' });
    return;
  }

  res.status(204).end();
});
