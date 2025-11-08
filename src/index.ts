// src/index.ts
import express from 'express';
import routes from './routes';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear o corpo das requisições como JSON
app.use(cors());
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