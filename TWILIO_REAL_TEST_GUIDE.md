# Guia de Testes com Números Reais do Twilio - Diário Fit

## 1. Configuração Atual

- Número do Twilio (remetente): +14155238886
- Seu número pessoal (destino): +5511911906825
- Ambiente: Produção (NODE_ENV=production)

## 2. Pré-requisitos

Antes de testar, certifique-se de que:

1. Seu número pessoal (+5511911906825) está adicionado à lista de números permitidos no Twilio Sandbox
2. O servidor backend está em execução em modo de produção
3. As variáveis de ambiente estão configuradas corretamente

## 3. Testar Envio de Mensagens Reais

### Usando o Script de Teste:
```bash
cd backend
node test-twilio-real.js
```

Este script testará três cenários:
1. Envio de mensagem real personalizada
2. Envio de mensagem com template
3. Envio de mensagem via endpoint padrão

### Usando cURL diretamente:
```bash
# Testar endpoint de teste rápido
curl -X POST http://localhost:3000/whatsapp/test-send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+5511911906825",
    "message": "Teste real via cURL"
  }'

# Testar endpoint padrão
curl -X POST http://localhost:3000/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+5511911906825",
    "message": "Teste padrão via cURL"
  }'
```

## 4. Verificar Resultados

Após executar os testes, verifique:

1. Se as mensagens chegaram no seu WhatsApp pessoal
2. Os logs do servidor backend para ver os registros de envio
3. O SID (identificador) das mensagens no console do Twilio

## 5. Testar Recebimento de Mensagens

Para testar o recebimento de mensagens, você precisa expor seu servidor local usando ngrok:

1. Instale o ngrok: https://ngrok.com/
2. Execute: `ngrok http 3000`
3. Anote a URL HTTPS fornecida pelo ngrok
4. No console do Twilio, configure o webhook para mensagens recebidas:
   - Vá para "Messaging" > "Services" > "WhatsApp"
   - Configure o "Webhook URL" como: `https://<sua-url-ngrok>.ngrok.io/whatsapp/webhook`

## 6. Comandos para Testar Funcionalidades Específicas

Envie estas mensagens do seu WhatsApp pessoal para o número do Twilio (+14155238886):

- "calcular imc" - Calcula o IMC do usuário
- "meta diária" - Mostra a meta calórica diária
- "Adicionei 150g de Arroz integral no almoço" - Registra um alimento
- "Meu peso é 70kg e minha altura é 175cm" - Atualiza peso e altura
- "Minha meta calórica é 2000 kcal" - Define meta calórica

## 7. Solução de Problemas

### Erros Comuns:

1. **"The phone number is not registered with WhatsApp"**:
   - Certifique-se de que seu número está registrado no WhatsApp e está usando o formato E.164

2. **"The message was not sent because the recipient is not opted in"**:
   - Você precisa primeiro enviar "Join [código]" do seu WhatsApp pessoal para o sandbox

3. **"Authentication failed"**:
   - Verifique se as credenciais do Twilio (Account SID e Auth Token) estão corretas

### Verificação de Logs:

Verifique os logs do servidor backend para mensagens de erro detalhadas:
```
[Nest] 12345 - 08/20/2025, 10:30:45 AM     LOG [TwilioService] Message sent to +5511911906825: Teste real
```

## 8. Monitoramento no Console do Twilio

No console do Twilio, você pode:

1. Ver todas as mensagens enviadas e recebidas
2. Verificar o status de entrega das mensagens
3. Visualizar os logs de erro detalhados
4. Monitorar o uso da API

Vá para:
- "Messaging" > "Monitor" > "Logs" para ver o histórico de mensagens
- "Messaging" > "Monitor" > "Errors" para ver erros detalhados