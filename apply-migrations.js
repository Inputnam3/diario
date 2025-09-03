const { Client } = require('pg');
const fs = require('fs').promises;

// Carregar variáveis de ambiente do .env do backend
require('dotenv').config({ path: './backend/.env' });

// Configurações do banco de dados
const dbConfig = {
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
};

// Função para aplicar uma migração
async function applyMigration(client, filePath) {
  console.log(`Aplicando migração: ${filePath}`);
  const sql = await fs.readFile(filePath, 'utf8');
  await client.query(sql);
  console.log(`Migração ${filePath} aplicada com sucesso.`);
}

// Função principal
async function main() {
  const client = new Client(dbConfig);
  
  try {
    // Conectar ao banco de dados
    await client.connect();
    console.log('Conectado ao banco de dados com sucesso.');
    
    // Aplicar as migrações na ordem correta
    await applyMigration(client, './supabase/migrations/001_create_profiles_table.sql');
    await applyMigration(client, './supabase/migrations/002_create_consumptions_table.sql');
    await applyMigration(client, './supabase/migrations/003_create_nutrition_goals_table.sql');
    
    console.log('Todas as migrações foram aplicadas com sucesso.');
  } catch (err) {
    console.error('Erro ao aplicar migrações:', err);
  } finally {
    // Fechar a conexão
    await client.end();
    console.log('Conexão com o banco de dados encerrada.');
  }
}

// Executar a função principal
main();