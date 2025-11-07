// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Cria uma instância global única do Prisma Client
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export default prisma;