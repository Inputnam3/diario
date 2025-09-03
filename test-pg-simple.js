console.log('Iniciando teste de conexão com pg...');

const { Client } = require('pg');

// Configuração de conexão
const client = new Client({
  user: 'postgres',
  password: 'qazwsxedcrfv123',
  host: 'db.xpdpdxjrithvzgfbetvz.supabase.co',
  port: 5432,
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000
});

console.log('Tentando conectar...');

// Tenta conectar e executar uma consulta simples
client.connect()
  .then(() => {
    console.log('✅ Conectado ao banco de dados!');
    return client.query('SELECT version()');
  })
  .then(result => {
    console.log('✅ Versão do PostgreSQL:', result.rows[0].version);
  })
  .catch(err => {
    console.error('❌ Erro:', err.message);
    console.error('Código:', err.code);
    console.error('Detalhes:', err);
  })
  .finally(() => {
    if (client) {
      client.end()
        .then(() => console.log('Conexão encerrada.'))
        .catch(console.error);
    }
  });
