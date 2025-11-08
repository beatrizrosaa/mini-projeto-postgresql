// src/index.ts
import express from 'express';
import routes from './routes';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'https://frontend-mini-projeto-dv1k.vercel.app', // <-- A URL do seu frontend (do log de erro)
  'http://localhost:5173'                         // <-- A URL do seu frontend local
];

// Middleware para parsear o corpo das requisições como JSON
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));
app.use(express.json());

// Conectar ao banco de dados


// Usar as rotas
app.use('/api', routes);

app.get('/', (req, res) => {
    res.status(200).json({ message: 'API is working!' });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});