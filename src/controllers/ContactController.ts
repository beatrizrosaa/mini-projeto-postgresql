import { Request, Response } from 'express';
import ContactService from '../services/ContactService';
import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma';

// Interface customizada para o Request, para "lembrar" o TypeScript que temos o req.userId
interface AuthRequest extends Request {
  userId?: string; // Adicionamos o userId como opcional
}

class ContactController {
  public async create(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ message: 'Usuário não autenticado.' });
      }

      const contact = await ContactService.create(req.body, userId);
      return res.status(201).json(contact); // 201 Created
    } catch (error: any) {
      // Se o erro for de validação do Prisma (ex: campo 'name' faltando)
      if (error instanceof Prisma.PrismaClientValidationError) {
        return res.status(400).json({ message: 'Dados inválidos.', details: error.message });
      }
      return res.status(500).json({ message: error.message });
    }
  }

  public async getAll(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ message: 'Usuário não autenticado.' });
      }

      const filters = req.query;
      const contacts = await ContactService.getAll(userId, filters);
      return res.status(200).json(contacts);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  // --- NÓS ESTAMOS ADICIONANDO ESTES MÉTODOS ABAIXO ---

  /**
   * GET /contacts/:id
   */
  public async getById(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = req.userId;
      const contactId = req.params.id;

      if (!userId) {
        return res.status(401).json({ message: 'Usuário não autenticado.' });
      }
      
      const contact = await ContactService.getById(contactId, userId);

      // Se o contato não for encontrado (ou não pertencer ao usuário), retornamos 404
      if (!contact) {
        return res.status(404).json({ message: 'Contato não encontrado.' });
      }

      return res.status(200).json(contact);
    } catch (error: any) {
      // Se o ID for inválido (ex: "123") o Prisma dá um erro
      if (error instanceof Prisma.PrismaClientValidationError) {
        return res.status(400).json({ message: 'ID do contato inválido.' });
      }
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * PUT /contacts/:id
   */
  public async replace(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = req.userId;
      const contactId = req.params.id;

      if (!userId) {
        return res.status(401).json({ message: 'Usuário não autenticado.' });
      }

      const updatedContact = await ContactService.replace(contactId, userId, req.body);

      if (!updatedContact) {
        return res.status(404).json({ message: 'Contato não encontrado.' });
      }

      return res.status(200).json(updatedContact);
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientValidationError) {
        return res.status(400).json({ message: 'ID do contato inválido.' });
      }
      if (error instanceof Prisma.PrismaClientValidationError) {
        return res.status(400).json({ message: 'Dados inválidos.', details: error.message });
      }
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * PATCH /contacts/:id
   */
  public async update(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = req.userId;
      const contactId = req.params.id;

      if (!userId) {
        return res.status(401).json({ message: 'Usuário não autenticado.' });
      }

      const updatedContact = await ContactService.update(contactId, userId, req.body);

      if (!updatedContact) {
        return res.status(404).json({ message: 'Contato não encontrado.' });
      }

      return res.status(200).json(updatedContact);
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientValidationError) {
        return res.status(400).json({ message: 'ID do contato inválido.' });
      }
      if (error instanceof Prisma.PrismaClientValidationError) {
        return res.status(400).json({ message: 'Dados inválidos.', details: error.message });
      }
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * DELETE /contacts/:id
   */
  public async deleteById(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = req.userId;
      const contactId = req.params.id;

      if (!userId) {
        return res.status(401).json({ message: 'Usuário não autenticado.' });
      }

      const deletedContact = await ContactService.deleteById(contactId, userId);

      if (!deletedContact) {
        return res.status(404).json({ message: 'Contato não encontrado.' });
      }

      // 204 No Content é a resposta padrão para um DELETE bem-sucedido
      return res.status(204).send();
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientValidationError) {
        return res.status(400).json({ message: 'ID do contato inválido.' });
      }
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new ContactController();