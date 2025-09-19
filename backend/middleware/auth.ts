import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// JWT-Secret aus Umgebungsvariablen
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

/**
 * Middleware zur Authentifizierung
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization-Header fehlt.' });
  }

  const token = authHeader.split(' ')[1]; // Bearer <token>
  if (!token) {
    return res.status(401).json({ error: 'Token fehlt.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    (req as any).user = decoded; // Benutzerinformationen an die Anfrage anhängen
    next();
  } catch (err) {
    console.error('[authMiddleware]', err);
    return res.status(401).json({ error: 'Ungültiges Token.' });
  }
};

/**
 * Middleware zur Autorisierung (Admin-Check)
 */
export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;

  if (!user || !user.isAdmin) {
    return res.status(403).json({ error: 'Zugriff verweigert.' });
  }

  next();
};