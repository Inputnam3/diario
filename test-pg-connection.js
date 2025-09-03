const { Client } = require('pg');
require('dotenv').config();

async function testConnection() {
  console.log('Testando conexão com o banco de dados...');
  
  // Extrai as informações de conexão da URL do banco de dados
  const dbUrl = process.env.SUPABASE_DB_URL;
  if (!dbUrl) {
    console.error('Erro: SUPABASE_DB_URL não está definido no arquivo .env');
    return;
  }

  // Cria um cliente PostgreSQL
  const client = new Client({
    connectionString: dbUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Tenta conectar ao banco de dados
    await client.connect();
    console.log('✅ Conectado ao banco de dados com sucesso!');
    
    // Executa uma consulta simples
    const result = await client.query('SELECT version()');
    console.log('Versão do PostgreSQL:', result.rows[0].version);
    
    // Lista os bancos de dados disponíveis
    const dbs = await client.query('SELECT datname FROM pg_database WHERE datistemplate = false');
    console.log('\nBancos de dados disponíveis:');
    console.table(dbs.rows);
    
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:');
    console.error(error.message);
    
    if (error.code === '28P01') {
      console.error('\nErro de autenticação. Verifique se o usuário e senha estão corretos.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\nNão foi possível conectar ao servidor. Verifique se o servidor está em execução e acessível.');
    } else if (error.code === 'ENOTFOUND') {
      console.error('\nNome do host não encontrado. Verifique a URL de conexão.');
    }
    
  } finally {
    if (client) {
      await client.end();
      console.log('\nConexão encerrada.');
    }
  }
}

testConnection();
