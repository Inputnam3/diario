const https = require('https');

// URL da função
const url = 'https://xpdpdxjrithvzgfbetvz.supabase.co/functions/v1/twilio-whatsapp-webhook';

// Dados de teste simulando um payload do Twilio
const postData = `Body=Comi%20150g%20de%20arroz%20no%20almo%C3%A7o&From=whatsapp%3A%2B5511999999999&To=whatsapp%3A%2B14155238886&MessageSid=SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX&NumMedia=0`;

const options = {
  hostname: 'xpdpdxjrithvzgfbetvz.supabase.co',
  port: 443,
  path: '/functions/v1/twilio-whatsapp-webhook',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData),
    // Adicionando um header de autorização básico para ver se passa da validação
    'Authorization': 'Bearer test-token'
  }
};

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(`Corpo: ${data}`);
    console.log('Requisição finalizada');
  });
});

req.on('error', (e) => {
  console.error(`Problema com a requisição: ${e.message}`);
});

// Escreve os dados no corpo da requisição
req.write(postData);
req.end();