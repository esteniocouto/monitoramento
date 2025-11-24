
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: {
        id: number;
        nome: string;
        role: string;
        iat: number;
        exp: number;
    };
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = (req as any).headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return (res as any).status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_padrao');
        (req as any).user = verified;
        next();
    } catch (err) {
        (res as any).status(403).json({ message: 'Token inválido ou expirado.' });
    }
};

export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!user) {
        return (res as any).status(401).json({ message: 'Usuário não autenticado.' });
    }
    
    if (user.role !== 'ADMIN') {
        return (res as any).status(403).json({ message: 'Acesso negado. Requer privilégios de administrador.' });
    }
    next();
};
