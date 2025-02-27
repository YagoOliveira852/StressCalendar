import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { executeQuery } from './database.js';
import * as readline from 'readline';

// Definir __dirname corretamente no ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Definir caminho correto do CSV (dentro da pasta 'assets')
const csvFilePath = path.join(__dirname, '../assets/Estresse-Ricardo.csv');

// Função para importar o CSV para o banco de dados
const importCSV = async () => {
    try {
        if (!fs.existsSync(csvFilePath)) {
            console.error('Erro: O arquivo CSV não foi encontrado no caminho:', csvFilePath);
            return;
        }

        const fileStream = fs.createReadStream(csvFilePath);
        const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

        let isFirstLine = true;
        for await (const line of rl) {
            if (isFirstLine) {
                isFirstLine = false;
                continue;
            }

            const [timestamp, stressLevel] = line.split(',');
            if (!timestamp || !stressLevel) continue;

            await executeQuery(
                `INSERT INTO stress_data (timestamp, stressLevel) VALUES (?, ?)`,
                [timestamp.trim(), parseInt(stressLevel.trim(), 10)]
            );
        }

        console.log('Dados do CSV importados com sucesso no banco de dados!');
    } catch (error) {
        console.error('Erro ao importar CSV:', error);
    }
};

importCSV();
