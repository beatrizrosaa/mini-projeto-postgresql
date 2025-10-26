// src/services/ContactService.ts
import prisma from '../lib/prisma';
import { Contact, Prisma } from '@prisma/client';

// Define o tipo de dados que esperamos para a criação (sem o ID do usuário)
type CreateContactData = Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'userId'>;
// Define o tipo de dados para filtros (vem da query string)
type FilterContactData = {
  name?: string;
  email?: string;
};

class ContactService {
  /**
   * Cria um novo contato associado a um usuário.
   */
  public async create(data: CreateContactData, userId: string): Promise<Contact> {
    try {
      // (Tradução) O 'user: { connect: { id: userId } }' é a forma
      // do Prisma de criar o "link" da relação no momento da criação.
      const contact = await prisma.contact.create({
        data: {
          name: data.name,
          email: data.email, // Será 'null' se não for passado
          phone: data.phone,
          user: {
            connect: { id: userId },
          },
        },
      });
      return contact;
    } catch (error) {
      console.error('Erro ao criar contato:', error);
      throw new Error('Erro ao criar contato.');
    }
  }

  /**
   * Lista todos os contatos de um usuário específico, com filtros.
   */
  public async getAll(userId: string, filters: FilterContactData): Promise<Contact[]> {
    try {
      // (Tradução) O 'where' do Prisma é o 'find' do Mongoose
      const whereClause: Prisma.ContactWhereInput = {
        userId: userId, // A MÁGICA DA SEGURANÇA: sempre filtra pelo usuário logado
      };

      // (Tradução) A sintaxe do filtro mudou de '$regex' para 'contains'
      if (filters.name) {
        whereClause.name = {
          contains: filters.name,
          mode: 'insensitive', // Equivalente ao '$options: "i"'
        };
      }
      if (filters.email) {
        whereClause.email = {
          contains: filters.email,
          mode: 'insensitive',
        };
      }

      const contacts = await prisma.contact.findMany({
        where: whereClause,
      });
      return contacts;
    } catch (error) {
      console.error('Erro ao listar contatos:', error);
      throw new Error('Erro ao listar contatos.');
    }
  }

  /**
   * Busca um contato específico pelo ID, mas APENAS se ele pertencer ao usuário.
   */
  public async getById(contactId: string, userId: string): Promise<Contact | null> {
    try {
      // (Tradução) 'findOne' vira 'findFirst' para checagem de segurança
      // Procura um contato que tenha o 'id' E o 'userId' corretos.
      const contact = await prisma.contact.findFirst({
        where: {
          id: contactId,
          userId: userId,
        },
      });
      return contact;
    } catch (error) {
      console.error('Erro ao buscar contato por ID:', error);
      throw new Error('Erro ao buscar contato por ID.');
    }
  }

  /**
   * Substitui (PUT) um contato, garantindo a posse.
   */
  public async replace(contactId: string, userId: string, data: CreateContactData): Promise<Contact> {
    try {
      // 1. (Segurança) Verifica se o contato existe E pertence ao usuário
      const existingContact = await prisma.contact.findFirst({
        where: { id: contactId, userId: userId },
      });

      if (!existingContact) {
        throw new Error('Contato não encontrado ou acesso negado.');
      }

      // 2. (Tradução) 'findOneAndReplace' vira 'update'
      // Nota: O PUT substitui o objeto, então passamos todos os campos.
      const updatedContact = await prisma.contact.update({
        where: { id: contactId },
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
        },
      });
      return updatedContact;
    } catch (error) {
      console.error('Erro ao substituir (PUT) contato:', error);
      throw new Error('Erro ao substituir contato.');
    }
  }

  /**
   * Atualiza parcialmente (PATCH) um contato, garantindo a posse.
   */
  public async update(contactId: string, userId: string, data: Partial<CreateContactData>): Promise<Contact> {
    try {
      // 1. (Segurança) Verifica se o contato existe E pertence ao usuário
      const existingContact = await prisma.contact.findFirst({
        where: { id: contactId, userId: userId },
      });

      if (!existingContact) {
        throw new Error('Contato não encontrado ou acesso negado.');
      }

      // 2. (Tradução) 'findOneAndUpdate' vira 'update'
      // Nota: O PATCH mescla os dados, então passamos o 'data' diretamente.
      const updatedContact = await prisma.contact.update({
        where: { id: contactId },
        data: data, // O Prisma só atualiza os campos que estão em 'data'
      });
      return updatedContact;
    } catch (error) {
      console.error('Erro ao atualizar (PATCH) contato:', error);
      throw new Error('Erro ao atualizar contato.');
    }
  }

  /**
   * Deleta um contato, garantindo a posse.
   */
  public async deleteById(contactId: string, userId: string): Promise<Contact> {
    try {
      // 1. (Segurança) Verifica se o contato existe E pertence ao usuário
      const existingContact = await prisma.contact.findFirst({
        where: { id: contactId, userId: userId },
      });

      if (!existingContact) {
        throw new Error('Contato não encontrado ou acesso negado.');
      }
      
      // 2. (Tradução) 'findOneAndDelete' vira 'delete'
      const deletedContact = await prisma.contact.delete({
        where: { id: contactId },
      });
      return deletedContact;
    } catch (error) {
      console.error('Erro ao deletar contato:', error);
      throw new Error('Erro ao deletar contato.');
    }
  }
}

export default new ContactService();