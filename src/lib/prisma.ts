// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Cria uma instância global única do Prisma Client
const prisma = new PrismaClient({
  // Opcional: Adiciona log para vermos as queries no terminal
  log: ['query', 'info', 'warn', 'error'],
});

export default prisma;