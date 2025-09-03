// Carrega as variáveis de ambiente
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

// Lista de variáveis que esperamos encontrar
const expectedVars = [
  'NODE_ENV',
  'PORT',
  'SUPABASE_DB_URL',
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'WHATSAPP_SESSION_PATH',
  'WHATSAPP_HEADLESS',
  'WHATSAPP_QR_TIMEOUT',
  'FRONTEND_URL'
];

console.log('Variáveis de ambiente carregadas:');
console.log('================================');

// Verifica cada variável esperada
let allVarsExist = true;

for (const varName of expectedVars) {
  const exists = process.env[varName] !== undefined;
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${varName}: ${exists ? 'Definida' : 'Não definida'}`);
  
  if (!exists) {
    allVarsExist = false;
  } else if (varName.endsWith('KEY') || varName.endsWith('URL')) {
    // Mostra apenas os primeiros e últimos caracteres de chaves e URLs por segurança
    const value = process.env[varName] || '';
    const masked = value.length > 15 
      ? `${value.substring(0, 10)}...${value.substring(value.length - 5)}` 
      : '********';
    console.log(`   Valor: ${masked}`);
  }
}

console.log('\nArquivo .env carregado de:', require('path').resolve(__dirname, '.env'));

if (!allVarsExist) {
  console.log('\n❌ Algumas variáveis necessárias não estão definidas.');
  console.log('Por favor, verifique seu arquivo .env e certifique-se de que todas as variáveis necessárias estão definidas.');
} else {
  console.log('\n✅ Todas as variáveis necessárias estão definidas!');
}
