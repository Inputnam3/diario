console.log('Script iniciado!');
console.log('Carregando dotenv...');
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

console.log('Variáveis de ambiente carregadas:');
console.log('SUPABASE_DB_URL:', process.env.SUPABASE_DB_URL ? '***URL DEFINIDA***' : 'NÃO DEFINIDA');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '***URL DEFINIDA***' : 'NÃO DEFINIDA');
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '***CHAVE DEFINIDA***' : 'NÃO DEFINIDA');

// Se não tivermos a URL do banco de dados, encerramos aqui
if (!process.env.SUPABASE_DB_URL) {
  console.error('Erro: SUPABASE_DB_URL não está definido no arquivo .env');
  process.exit(1);
}

// Extrai as informações de conexão da URL
const dbUrl = process.env.SUPABASE_DB_URL;
console.log('\nTentando conectar ao banco de dados...');
console.log('Host:', new URL(dbUrl).hostname);

// Tenta carregar o módulo pg
let pg;
try {
  console.log('Carregando módulo pg...');
  pg = require('pg');
  console.log('Módulo pg carregado com sucesso!');
} catch (error) {
  console.error('Erro ao carregar o módulo pg:');
  console.error(error);
  console.log('\nTentando instalar o módulo pg...');
  
  // Tenta instalar o módulo pg globalmente
  const { execSync } = require('child_process');
  try {
    execSync('npm install -g pg', { stdio: 'inherit' });
    console.log('Módulo pg instalado com sucesso!');
    pg = require('pg');
  } catch (installError) {
    console.error('Erro ao instalar o módulo pg:');
    console.error(installError);
    process.exit(1);
  }
}

// Cria um cliente PostgreSQL
const client = new pg.Client({
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000 // 10 segundos de timeout
});

// Tenta conectar ao banco de dados
console.log('\nTentando estabelecer conexão...');
client.connect()
  .then(() => {
    console.log('✅ Conectado ao banco de dados com sucesso!');
    
    // Executa uma consulta simples
    return client.query('SELECT version()')
      .then(result => {
        console.log('Versão do PostgreSQL:', result.rows[0].version);
        return client.query("SELECT datname FROM pg_database WHERE datistemplate = false");
      })
      .then(result => {
        console.log('\nBancos de dados disponíveis:');
        console.table(result.rows);
      });
  })
  .catch(error => {
    console.error('❌ Erro ao conectar ao banco de dados:');
    console.error('Código:', error.code);
    console.error('Mensagem:', error.message);
    
    if (error.code === '28P01') {
      console.error('\nErro de autenticação. Verifique se o usuário e senha estão corretos.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\nNão foi possível conectar ao servidor. Verifique se o servidor está em execução e acessível.');
    } else if (error.code === 'ENOTFOUND') {
      console.error('\nNome do host não encontrado. Verifique a URL de conexão.');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('\nTempo limite de conexão esgotado. Verifique sua conexão com a internet ou se o servidor está acessível.');
    }
  })
  .finally(() => {
    if (client) {
      console.log('\nEncerrando conexão...');
      client.end()
        .then(() => console.log('Conexão encerrada com sucesso!'))
        .catch(err => console.error('Erro ao encerrar conexão:', err));
    }
  });
