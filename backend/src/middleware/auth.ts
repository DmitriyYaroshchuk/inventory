import type { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../services/auth.service';

export const requireAuth = <P>(req: Request<P>, res: Response, next: NextFunction) => {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  const userId = token ? verifyToken(token) : null;

  if (userId === null) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  res.locals.userId = userId;
  next();
};
