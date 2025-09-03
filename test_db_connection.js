const { Client } = require('pg');

// Configurações do banco de dados do Supabase (atualize com a nova senha)
const dbConfig = {
  connectionString: 'postgresql://postgres:j2Bp1xce74XD5caV@db.xpdpdxjrithvzgfbetvz.supabase.co:5432/postgres',
  ssl: {
    rejectUnauthorized: false // Apenas para desenvolvimento, em produção deve ser true
  }
};

async function testConnection() {
  const client = new Client(dbConfig);
  
  try {
    // Conectar ao banco de dados
    await client.connect();
    console.log('Conectado ao banco de dados do Supabase com sucesso.');
    
    // Executar uma query simples
    const res = await client.query('SELECT NOW()');
    console.log('Query executada com sucesso:', res.rows[0]);
    
  } catch (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } finally {
    // Fechar a conexão
    await client.end();
    console.log('Conexão com o banco de dados encerrada.');
  }
}

testConnection();