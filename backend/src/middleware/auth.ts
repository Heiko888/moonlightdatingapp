import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Erweitere Request Interface um user Property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access Token erforderlich' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    req.user = {
      id: decoded.userId,
      email: decoded.email
    };
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Ungültiger Token' });
  }
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
      req.user = {
        id: decoded.userId,
        email: decoded.email
      };
    } catch (error) {
      // Token ungültig, aber nicht erforderlich
    }
  }
  next();
};
