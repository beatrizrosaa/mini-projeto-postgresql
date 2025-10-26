// src/routes/index.ts
import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import { authMiddleware } from '../middlewares/AuthMiddleware';
import ContactRoutes from './ContactRoutes';

const routes = Router();

// --- Rotas Públicas ---
routes.post('/register', AuthController.register);
routes.post('/login', AuthController.login);
routes.use('/contacts', authMiddleware, ContactRoutes);
// --- Rotas Protegidas ---
routes.get('/protected', authMiddleware, (req, res) => {
    res.status(200).json({ message: "Acesso autorizado à rota protegida!" });
});

export default routes;