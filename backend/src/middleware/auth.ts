import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: any;
}

export const verifyToken = (req: any, res: any, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_padrao');
        (req as any).user = verified;
        next();
    } catch (err) {
        res.status(403).json({ message: 'Token inválido ou expirado.' });
    }
};

export const verifyAdmin = (req: any, res: any, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Acesso negado. Requer privilégios de administrador.' });
    }
    next();
};