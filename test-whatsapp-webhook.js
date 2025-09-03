const fetch = require('node-fetch');
const FormData = require('form-data');

// URL da sua função local (quando executada com supabase functions serve)
const FUNCTION_URL = 'http://localhost:54321/functions/v1/whatsapp-webhook';

// Dados de teste - simula uma mensagem do Twilio
async function testWebhook(message) {
  const form = new FormData();
  
  // Adiciona os campos que o Twilio envia
  form.append('Body', message);
  form.append('From', 'whatsapp:+5511999998888'); // Número de teste
  form.append('To', 'whatsapp:+5511999999999'); // Seu número do Twilio
  form.append('MessageSid', 'SM' + Math.random().toString(36).substring(2, 15));
  form.append('NumMedia', '0');

  try {
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      body: form,
      headers: {
        ...form.getHeaders(),
        // Adicione a autenticação se necessário
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
      }
    });

    const result = await response.text();
    console.log('Status:', response.status);
    console.log('Resposta:', result);
  } catch (error) {
    console.error('Erro ao testar webhook:', error);
  }
}

// Teste com diferentes formatos de mensagem
const testMessages = [
  'comi 150g de arroz no almoço',
  'almoço: 200g de frango',
  '100g de banana',
  'jantar: 120g de salada',
  'lanche: 50g de castanha'
];

// Executa os testes
async function runTests() {
  for (const message of testMessages) {
    console.log(`\n--- Testando: "${message}" ---`);
    await testWebhook(message);
    // Aguarda 1 segundo entre os testes
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Cria um usuário de teste no Supabase Auth
async function createTestUser() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Defina as variáveis de ambiente SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY');
    return;
  }

  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, supabaseKey);

  const phoneNumber = '+5511999998888';
  
  try {
    // Cria o usuário no Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      phone: phoneNumber,
      password: 'senhasegura123',
      email_confirm: true
    });

    if (authError) throw authError;
    
    const userId = authData.user.id;
    
    // Cria o perfil do usuário
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        { 
          id: userId,
          phone_number: phoneNumber.replace('+', ''), // Remove o + para armazenar
          name: 'Usuário de Teste'
        }
      ]);

    if (profileError) throw profileError;

    console.log('Usuário de teste criado com sucesso!');
    console.log('ID do usuário:', userId);
    console.log('Número de telefone:', phoneNumber);
    
  } catch (error) {
    if (error.message.includes('already registered')) {
      console.log('Usuário de teste já existe');
    } else {
      console.error('Erro ao criar usuário de teste:', error);
    }
  }
}

// Executa os testes
async function main() {
  console.log('=== Teste do Webhook do WhatsApp ===');
  
  // 1. Primeiro, cria um usuário de teste
  console.log('\nCriando usuário de teste...');
  await createTestUser();
  
  // 2. Aguarda um pouco para o usuário ser criado
  console.log('\nAguardando processamento...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 3. Executa os testes
  console.log('\nIniciando testes...');
  await runTests();
  
  console.log('\n=== Testes concluídos ===');
}

main().catch(console.error);
