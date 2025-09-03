const { Client } = require('pg');
require('dotenv').config({ path: './backend/.env' });

const client = new Client({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

async function main() {
  try {
    await client.connect();
    console.log('Conectado ao banco de dados com sucesso.');
    
    const res = await client.query('SELECT id, email, created_at FROM users ORDER BY created_at ASC;');
    
    console.log('\n--- Lista de usuários ---');
    res.rows.forEach(row => {
      console.log(`  ID: ${row.id}, Email: ${row.email}, Criado em: ${row.created_at}`);
    });
    
    console.log('\n--- Verificação concluída ---');
  } catch (err) {
    console.error('Erro ao verificar usuários:', err);
  } finally {
    await client.end();
    console.log('Conexão com o banco de dados encerrada.');
  }
}

main();