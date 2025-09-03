const { Client } = require('pg');

// Configuração manual com a senha fornecida
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

console.log('Tentando conectar ao banco de dados...');
console.log('Host:', config.host);
console.log('Usuário:', config.user);

const client = new Client(config);

client.connect()
  .then(() => {
    console.log('✅ Conectado ao banco de dados com sucesso!');
    return client.query('SELECT version()');
  })
  .then(result => {
    console.log('✅ Versão do PostgreSQL:', result.rows[0].version);
    return client.query('SELECT current_database() as db, current_user as user');
  })
  .then(result => {
    console.log('✅ Informações da conexão:');
    console.table(result.rows);
    return client.query("SELECT datname FROM pg_database WHERE datistemplate = false");
  })
  .then(result => {
    console.log('\n📊 Bancos de dados disponíveis:');
    console.table(result.rows);
  })
  .catch(error => {
    console.error('❌ Erro ao conectar ao banco de dados:');
    console.error('Código:', error.code);
    console.error('Mensagem:', error.message);
    
    if (error.code === '28P01') {
      console.error('\n❌ Erro de autenticação. A senha fornecida está incorreta.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n❌ Não foi possível conectar ao servidor. Verifique sua conexão com a internet.');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('\n❌ Tempo limite de conexão esgotado. Verifique sua conexão com a internet.');
    } else {
      console.error('\nDetalhes do erro:', error);
    }
  })
  .finally(() => {
    if (client) {
      client.end()
        .then(() => console.log('\n🔌 Conexão encerrada.'))
        .catch(err => console.error('Erro ao encerrar conexão:', err));
    }
  });
