const { Client } = require('pg');

// Configuração de conexão com timeout curto
const config = {
  user: 'postgres',
  password: 'qazwsxedcrfv123',
  host: 'db.xpdpdxjrithvzgfbetvz.supabase.co',
  port: 5432,
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 5000, // 5 segundos
  query_timeout: 5000,
  statement_timeout: 5000
};

console.log('Iniciando teste de conexão com timeout curto...');
const client = new Client(config);

// Usando Promise.race para implementar um timeout personalizado
const connectPromise = client.connect();
const timeoutPromise = new Promise((_, reject) => 
  setTimeout(() => reject(new Error('Tempo limite de conexão excedido')), 5000)
);

Promise.race([connectPromise, timeoutPromise])
  .then(() => {
    console.log('✅ Conectado com sucesso!');
    return client.query('SELECT 1 as test');
  })
  .then(result => {
    console.log('✅ Teste de consulta bem-sucedido:', result.rows[0]);
  })
  .catch(error => {
    console.error('❌ Erro:');
    console.error('Mensagem:', error.message);
    console.error('Código:', error.code);
  })
  .finally(() => {
    if (client) {
      client.end()
        .then(() => console.log('\nConexão encerrada.'))
        .catch(console.error);
    }
  });
