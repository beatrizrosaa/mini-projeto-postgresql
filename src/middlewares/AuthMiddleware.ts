// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const JWT_SECRET = process.env.JWT_SECRET!;

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        console.warn('[AuthMiddleware] Tentativa de acesso sem token.');
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    // O formato é "Bearer TOKEN_AQUI"
    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
        console.warn('[AuthMiddleware] Token com formato inválido.');
        return res.status(401).json({ message: 'Token com formato inválido.' });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        console.warn('[AuthMiddleware] Token mal formatado (sem "Bearer").');
        return res.status(401).json({ message: 'Token mal formatado.' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('[AuthMiddleware] Token inválido:', err.message);
            return res.status(401).json({ message: 'Token inválido.' });
        }
        
        // Se quiser, pode anexar o id do usuário na requisição
        (req as any).userId = (decoded as any).id;

        console.log('[AuthMiddleware] Acesso autorizado para rota protegida.');
        return next();
    });
};