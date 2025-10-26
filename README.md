# mini-projeto-postgresql

Mini-Projeto: API de Autenticação e Contatos (Node.js, Express, TS, PostgreSQL + Prisma)
Este projeto é uma migração da API backend-express-mongodb. O objetivo foi substituir a stack NoSQL (MongoDB + Mongoose) por uma stack SQL relacional (PostgreSQL + Prisma ORM).

A API backend completa implementa autenticação de usuários (Registro/Login com JWT) e um CRUD completo de Contatos. A principal regra de negócio é o isolamento de dados: um usuário autenticado só pode ver, editar ou deletar os contatos que ele mesmo criou.

A aplicação é configurada para se conectar tanto a um banco de dados PostgreSQL local (gerenciado por Podman/Docker) quanto a um banco na nuvem (ex: Neon ou Supabase), e está pronta para deploy na Vercel.

🎥 Demonstração do Projeto (PostgreSQL)
[INSERIR NOVO LINK DO YOUTUBE AQUI] (É importante que você grave um novo vídeo demonstrando este projeto, mostrando o DBeaver, o Prisma e o deploy no Vercel com o banco Postgres).

✨ Features
Autenticação:

Registro de Usuário: Criação de novos usuários com senha criptografada (bcrypt).

Login de Usuário: Autenticação de usuários existentes, retornando um token JWT.

Rotas Protegidas: Middlewares que verificam a validade do token JWT.

CRUD de Contatos:

Criação, Leitura, Atualização e Deleção de contatos pessoais (nome, email, telefone).

Isolamento de Dados: Usuários só podem acessar, modificar ou deletar os contatos que eles mesmos criaram.

Filtragem de Dados: Permite a busca de contatos por name ou email.

Infraestrutura com Prisma:

Schema Declarativo: Um único arquivo (prisma/schema.prisma) define os modelos e relações.

Migrações Seguras: O prisma migrate gera e executa o SQL para manter o banco de dados em sincronia com o schema.

Pronto para Deploy: Totalmente configurado para deploy contínuo na Vercel.

🛠️ Tecnologias Utilizadas
Backend: Node.js, Express, TypeScript

Banco de Dados: PostgreSQL

ORM: Prisma (como ORM, cliente de query e ferramenta de migração)

Autenticação: JSON Web Token (JWT), bcrypt.js

Ambiente Local: Podman (ou Docker) com docker-compose.yaml (serviço: postgres:15-alpine)

Deploy: Vercel

Desenvolvimento: ts-node-dev (live-reload), env-cmd (para carregar .env em scripts)

Validação: cors

🚀 Começando
Siga estas instruções para obter uma cópia do projeto e executá-la em sua máquina local para desenvolvimento e testes.

Pré-requisitos
Node.js (v18 ou superior)

Git

Podman (ou Docker)

(Recomendado) Um cliente de banco SQL como DBeaver ou PgAdmin.

1. Instalação Local
Clone o novo repositório:

Bash

git clone https://github.com/beatrizrosaa/backend-express-postgresql.git
cd backend-express-postgresql
Instale as dependências:

Bash

npm install
Configure as Variáveis de Ambiente: Crie um arquivo chamado .env na raiz do projeto. O Prisma usa uma variável principal para o banco.

Snippet de código

# URL de Conexão do Banco de Dados (PostgreSQL)
# Formato: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
# (Estes valores correspondem ao docker-compose.yaml)
DATABASE_URL="postgresql://api-user:api-password@localhost:5432/api-db"

# Segredo para o JWT
JWT_SECRET=MINHA_CHAVE_SUPER_SECRETA_PARA_PROJETO
JWT_EXPIRES_IN=1h

# Porta do servidor (use 3001 para rodar junto com o projeto Mongo)
PORT=3001
2. Rodando o Banco de Dados Local (Podman/Docker)
Este projeto usa um docker-compose.yaml para subir um banco PostgreSQL.

Inicie o contêiner:

Bash

podman compose up -d
Conecte-se (via DBeaver):

Host: localhost

Porta: 5432

Banco de Dados: api-db

Usuário: api-user

Senha: api-password

3. Rodando a Aplicação (Duas Etapas)
Com o banco de dados no ar, precisamos criar as tabelas e iniciar o servidor.

Etapa 1: Rodar as Migrações (Crucial) Este comando lê o prisma/schema.prisma e cria as tabelas users e contacts no seu banco api-db.

Bash

npm run prisma -- migrate dev --name init
Etapa 2: Iniciar o Servidor (Modo Dev) Com as tabelas prontas, inicie a API:

Bash

npm run dev
O servidor estará no ar em http://localhost:3001.

📦 API Endpoints
Todas as rotas são prefixadas com /api. (A estrutura das rotas é idêntica à do projeto MongoDB).

Autenticação (/api/auth)
POST /api/auth/register
Registra um novo usuário.

Body (JSON):

JSON

{ "name": "Bia Postgres", "email": "bia@postgres.com", "password": "senha123" }
POST /api/auth/login
Autentica um usuário e retorna um token JWT.

Body (JSON):

JSON

{ "email": "bia@postgres.com", "password": "senha123" }
CRUD de Contatos (/api/contacts)
Todas as rotas de contatos são protegidas e exigem um token JWT (Authorization: Bearer <token>).

POST /api/contacts
Cria um novo contato para o usuário autenticado.

Body (JSON):

JSON

{
  "name": "Contato Postgres",
  "email": "contato@pg.com",
  "phone": "99999-8888"
}
GET /api/contacts
Lista todos os contatos pertencentes ao usuário autenticado. (Suporta filtros ?name=... e ?email=...).

GET /api/contacts/:id
Busca um contato específico pelo ID.

Resposta de Erro (404 Not Found): Se o contato não for encontrado ou não pertencer ao usuário logado.

PUT /api/contacts/:id
Substitui todos os dados de um contato existente.

PATCH /api/contacts/:id
Atualiza parcialmente um contato existente.

DELETE /api/contacts/:id
Deleta um contato.

🌐 Deploy na Vercel
Este projeto está configurado para deploy contínuo na Vercel.

URL da Aplicação: [INSIRA A URL DA SUA NOVA VERCEL AQUI]

Configuração na Vercel
Para o deploy funcionar, você precisará de um banco PostgreSQL na nuvem. Recomenda-se usar o Neon ou Supabase, que possuem planos gratuitos.

Crie um banco de dados no Neon.

Copie a String de Conexão do seu banco Neon.

No painel do projeto na Vercel, vá em Settings -> Environment Variables e configure:

DATABASE_URL: (Cole a string de conexão completa do Neon aqui)

JWT_SECRET: (O mesmo segredo que você usa localmente)

JWT_EXPIRES_IN: (Ex: 1h ou 7d)