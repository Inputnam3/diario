const { Client } = require('pg');
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

// String de conexão fornecida
const connectionString = 'postgresql://postgres:qazwsxedcrfv123@db.xpdpdxjrithvzgfbetvz.supabase.co:5432/postgres';

console.log('Testando conexão com string de conexão...');

const client = new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000
});

client.connect()
  .then(() => {
    console.log('✅ Conectado com sucesso!');
    return client.query('SELECT current_user, current_database(), version() as version');
  })
  .then(result => {
    console.log('\nInformações da conexão:');
    console.table(result.rows[0]);
  })
  .catch(error => {
    console.error('❌ Erro:');
    console.error('Código:', error.code);
    console.error('Mensagem:', error.message);
    
    if (error.code === '28P01') {
      console.error('\n❌ Erro de autenticação. Verifique o usuário e senha na string de conexão.');
    }
  })
  .finally(() => {
    if (client) {
      client.end()
        .then(() => console.log('\n🔌 Conexão encerrada.'))
        .catch(console.error);
    }
  });
