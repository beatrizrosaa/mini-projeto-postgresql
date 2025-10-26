import { Router } from 'express';
import ContactController from '../controllers/ContactController';

const router = Router();

// POST /api/contacts
router.post('/', ContactController.create);

// GET /api/contacts (e /api/contacts?name=...)
router.get('/', ContactController.getAll);

// --- NÓS ESTAMOS ADICIONANDO ESTAS ROTAS ABAIXO ---

// GET /api/contacts/:id
router.get('/:id', ContactController.getById);

// PUT /api/contacts/:id
router.put('/:id', ContactController.replace);

// PATCH /api/contacts/:id
router.patch('/:id', ContactController.update);

// DELETE /api/contacts/:id
router.delete('/:id', ContactController.deleteById);

export default router;