// Carrega as variáveis de ambiente
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

// Verifica as variáveis necessárias
const requiredVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_DB_URL'
];

console.log('Verificando variáveis de ambiente:');
console.log('--------------------------------');

let allVarsExist = true;

requiredVars.forEach(varName => {
  const exists = process.env[varName] !== undefined;
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${varName}: ${exists ? 'Definida' : 'Não definida'}`);
  
  if (!exists) {
    allVarsExist = false;
  } else if (varName.endsWith('KEY') || varName.endsWith('URL')) {
    // Mostra apenas os primeiros e últimos caracteres de chaves e URLs por segurança
    const value = process.env[varName];
    const masked = value ? 
      `${value.substring(0, 10)}...${value.substring(value.length - 5)}` : 
      'vazia';
    console.log(`   Valor: ${masked}`);
  }
});

console.log('--------------------------------');

if (allVarsExist) {
  console.log('✅ Todas as variáveis necessárias estão definidas!');
  console.log('Tentando carregar a configuração do Supabase...');
  
  try {
    const { getSupabaseConfig } = require('./backend/src/config/supabase.config');
    const config = getSupabaseConfig({ get: (key) => process.env[key] });
    console.log('✅ Configuração do Supabase carregada com sucesso!');
    console.log('Detalhes da conexão:');
    console.log(`- Host: ${config.host}`);
    console.log(`- Porta: ${config.port}`);
    console.log(`- Banco de Dados: ${config.database}`);
    console.log(`- Usuário: ${config.username}`);
    console.log(`- SSL: ${config.ssl ? 'Ativado' : 'Desativado'}`);
  } catch (error) {
    console.error('❌ Erro ao carregar a configuração do Supabase:');
    console.error(error.message);
    if (error.stack) {
      console.error('Stack trace:');
      console.error(error.stack.split('\n').slice(0, 5).join('\n') + '\n...');
    }
  }
} else {
  console.error('❌ Algumas variáveis necessárias não estão definidas.');
  console.error('Por favor, verifique seu arquivo .env e certifique-se de que todas as variáveis necessárias estão definidas.');
}

console.log('\nConteúdo do arquivo .env:');
console.log('----------------------');
try {
  const fs = require('fs');
  const path = require('path');
  const envPath = path.resolve(__dirname, '.env');
  console.log(`Lendo de: ${envPath}`);
  
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    console.log(content);
  } else {
    console.error('Arquivo .env não encontrado no caminho:', envPath);
  }
} catch (error) {
  console.error('Erro ao ler o arquivo .env:', error.message);
}
