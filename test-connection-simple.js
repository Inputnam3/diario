const { Client } = require('pg');

// Configuração de conexão
const config = {
  user: 'postgres',
  password: 'qazwsxedcrfv123',
  host: 'db.xpdpdxjrithvzgfbetvz.supabase.co',
  port: 5432,
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000
};

console.log('Iniciando teste de conexão...');
console.log('Host:', config.host);
console.log('Usuário:', config.user);
console.log('Tentando conectar...');

// Cria uma nova conexão
const client = new Client(config);

// Tenta conectar
client.connect()
  .then(() => {
    console.log('✅ Conexão bem-sucedida!');
    return client.query('SELECT version()');
  })
  .then(result => {
    console.log('✅ Versão do PostgreSQL:', result.rows[0].version);
    return client.query('SELECT current_database() as db, current_user as user');
  })
  .then(result => {
    console.log('✅ Informações da conexão:');
    console.table(result.rows);
  })
  .catch(error => {
    console.error('❌ Erro na conexão:');
    console.error('Código:', error.code);
    console.error('Mensagem:', error.message);
    
    if (error.code === '28P01') {
      console.error('\n❌ Erro de autenticação. Senha incorreta.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n❌ Conexão recusada. Verifique o host e a porta.');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('\n❌ Tempo limite esgotado. Verifique sua conexão com a internet.');
    }
  })
  .finally(() => {
    if (client) {
      client.end()
        .then(() => console.log('\n🔌 Conexão encerrada.'))
        .catch(console.error);
    }
  });
