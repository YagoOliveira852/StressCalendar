import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './routes.js';
import { setupDatabase } from './database.js';

const app = express();
const PORT = 3001;

// Habilitar CORS
app.use(cors());

// Configuração do body-parser
app.use(bodyParser.json());

// Inicialize o banco de dados ao iniciar o servidor
(async () => {
    await setupDatabase();
    console.log('Banco de dados configurado.');
})();

// Rotas da API
app.use('/api', router);

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Backend rodando em http://localhost:${PORT}`);
});
