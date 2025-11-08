// src/services/AuthService.ts
import prisma from '../lib/prisma';
import { User } from '@prisma/client'; // Importa o TIPO 'User' do Prisma
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

// Define o tipo de dados que esperamos para o registro
type RegisterData = Pick<User, 'name' | 'email' | 'password'>;

class AuthService {
  /**
   * Registra um novo usuário.
   */
  public async register(data: RegisterData): Promise<Omit<User, 'password'>> {
    const { email, password, name } = data;

    if (!email || !password || !name) {
      throw new Error('Dados insuficientes para o registro.');
    }

    // 1. (Tradução) Verifica se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      throw new Error('Email já cadastrado.');
    }

    // 2. (Igual) Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. (Tradução) Cria o usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // 4. (Igual) Remove a senha da resposta
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Realiza o login.
   */
  public async login(email: string, password_input: string) {
    // 1. (Tradução) Encontra o usuário
    // Nota: O Prisma NÃO precisa do '.select("+password")', ele já traz por padrão.
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      throw new Error('Credenciais inválidas.'); // Erro genérico (segurança)
    }

    // 2. (Igual) Compara as senhas
    const isPasswordValid = await bcrypt.compare(password_input, user.password);

    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas.');
    }

    // 3. (Tradução) Gera o token
    // PONTO CRÍTICO: No Mongoose era user._id, no Prisma é user.id
    const token = jwt.sign(
      { id: user.id }, // <-- MUDANÇA IMPORTANTE difvdo
      process.env.JWT_SECRET!,
      
      { expiresIn: Number(process.env.JWT_EXPIRES_IN) || '1h' }
    );

    return { token };
  }
}

export default new AuthService();