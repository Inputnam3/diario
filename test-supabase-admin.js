const { Client } = require('pg');

// Configuração com usuário supabase_admin
const config = {
  user: 'supabase_admin',  // Usuário correto baseado no log
  password: 'qazwsxedcrfv123',  // Mantenha a mesma senha
  host: 'db.xpdpdxjrithvzgfbetvz.supabase.co',
  port: 5432,
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false
  },
  // Adiciona parâmetros específicos para o Supabase
  application_name: 'diario-fit-connection-test',
  // Força o uso de SCRAM-SHA-256
  sslmode: 'require',
  // Timeout reduzido para testes
  connectionTimeoutMillis: 10000
};

console.log('Iniciando teste de conexão com supabase_admin...');
console.log('Host:', config.host);
console.log('Usuário:', config.user);

const client = new Client(config);

client.connect()
  .then(() => {
    console.log('✅ Conectado com sucesso!');
    return client.query('SELECT current_user, current_database(), version() as version');
  })
  .then(result => {
    console.log('\nInformações da conexão:');
    console.table(result.rows[0]);
    
    // Lista as tabelas disponíveis
    return client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
  })
  .then(result => {
    console.log('\nTabelas disponíveis:');
    console.table(result.rows);
  })
  .catch(error => {
    console.error('❌ Erro:');
    console.error('Código:', error.code);
    console.error('Mensagem:', error.message);
    
    if (error.code === '28P01') {
      console.error('\n❌ Erro de autenticação. Verifique o usuário e senha.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n❌ Conexão recusada. Verifique o host e a porta.');
    }
  })
  .finally(() => {
    if (client) {
      client.end()
        .then(() => console.log('\n🔌 Conexão encerrada.'))
        .catch(console.error);
    }
  });
