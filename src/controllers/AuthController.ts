// src/controllers/AuthController.ts
import { Request, Response } from 'express';
import AuthService from '../services/AuthService';
// Não precisamos mais do 'mongoose' aqui

class AuthController {
  /**
   * POST /auth/register
   */
  public async register(req: Request, res: Response): Promise<Response> {
    try {
      const user = await AuthService.register(req.body);
      return res.status(201).json({ user });
    } catch (error: any) {
      // 409 Conflict (para email duplicado)
      if (error.message === 'Email já cadastrado.') {
        return res.status(409).json({ message: error.message });
      }
      // 400 Bad Request (para dados faltando)
      if (error.message === 'Dados insuficientes para o registro.') {
        return res.status(400).json({ message: error.message });
      }

      console.error('Erro no registro:', error);
      return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
  }

  /**
   * POST /auth/login
   */
  public async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      const { token } = await AuthService.login(email, password);
      return res.status(200).json({ token });
    } catch (error: any) {
      // 401 Unauthorized (para usuário não encontrado ou senha errada)
      if (error.message === 'Credenciais inválidas.') {
        return res.status(401).json({ message: error.message });
      }

      console.error('Erro no login:', error);
      return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
  }
}

export default new AuthController();