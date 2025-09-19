import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const secret = process.env.JWT_SECRET || 'supersecretkey';

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	if (!token) return res.status(401).json({ error: 'Token fehlt!' });
	jwt.verify(token, secret, (err, user) => {
		if (err) return res.status(403).json({ error: 'Token ungültig!' });
		(req as any).user = user;
		next();
	});
}
