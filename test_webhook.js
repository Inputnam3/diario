const https = require('https');

// URL do webhook
const url = 'https://xpdpdxjrithvzgfbetvz.supabase.co/functions/v1/whatsapp-webhook';

// Dados de teste simulando um payload do Twilio
const postData = JSON.stringify({
  Body: 'Comi 150g de arroz no almoço',
  From: 'whatsapp:+5511999999999', // Substitua por um número válido para teste
  To: 'whatsapp:+14155238886', // Número do Twilio
  MessageSid: 'SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  NumMedia: '0'
});

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(url, options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  res.on('data', (chunk) => {
    console.log(`Corpo: ${chunk}`);
  });
  res.on('end', () => {
    console.log('Requisição finalizada');
  });
});

req.on('error', (e) => {
  console.error(`Problema com a requisição: ${e.message}`);
});

// Escreve os dados no corpo da requisição
req.write(postData);
req.end();