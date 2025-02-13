import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Configuração do banco de dados usando sqlite3
export const setupDatabase = async () => {
  const db = await open({
    filename: './annotations.db', // Nome do arquivo do banco
    driver: sqlite3.Database,
  });

  // Criação da tabela se não existir
  await db.exec(`
      CREATE TABLE IF NOT EXISTS annotations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        cause TEXT,
        stressLevel INTEGER,
        startTime TEXT,
        endTime TEXT,
        description TEXT
      );
  `);

  return db;
};

// Função genérica para executar queries
export const executeQuery = async (query, params = []) => {
  const db = await setupDatabase();
  const result = await db.run(query, params);
  await db.close();
  return result;
};

// Função para obter dados com SELECT
export const fetchQuery = async (query, params = []) => {
  const db = await setupDatabase();
  const result = await db.all(query, params);
  await db.close();
  return result;
};
