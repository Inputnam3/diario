# Guia de Testes com Twilio Sandbox - Diário Fit

## 1. Configuração Inicial no Console do Twilio

1. Acesse https://console.twilio.com/
2. Faça login com suas credenciais
3. Navegue até "Messaging" > "Try it out" > "Send a WhatsApp message"
4. Anote o número do sandbox do WhatsApp (geralmente algo como `whatsapp:+14155238886`)

## 2. Configurar Número Permitido

1. No mesmo painel do sandbox, você verá uma mensagem como:
   "To enable messaging from your personal WhatsApp account to your Twilio Sandbox, send a WhatsApp message from your personal device to your Sandbox number with the following code: Join [código]"

2. Envie uma mensagem do seu WhatsApp pessoal para o número do sandbox com o texto:
   "Join [código]" (substitua [código] pelo código fornecido)

3. Você receberá uma confirmação de que seu número foi adicionado à lista de permitidos

## 3. Testar Envio de Mensagens

### Usando o Console do Twilio:
1. No painel do sandbox, há uma seção "Send a WhatsApp message"
2. Insira seu número pessoal no campo "To" (formato E.164: +5511999999999)
3. Digite uma mensagem no campo "Message"
4. Clique em "Send message"

### Usando o Script de Teste:
1. Certifique-se de que o servidor backend está em execução
2. Execute o script de teste:
   ```
   cd backend
   node test-twilio-sandbox.js
   ```

## 4. Testar Webhook de Recebimento

1. Envie uma mensagem do seu WhatsApp pessoal para o número do sandbox
2. O webhook configurado no backend deve receber e processar a mensagem
3. Verifique os logs do servidor para ver o processamento

## 5. Testar Comandos Específicos

Envie mensagens do seu WhatsApp com os seguintes comandos para testar funcionalidades específicas:

- "calcular imc" - Calcula o IMC do usuário
- "meta diária" - Mostra a meta calórica diária
- "Adicionei 150g de Arroz integral no almoço" - Registra um alimento
- "Meu peso é 70kg e minha altura é 175cm" - Atualiza peso e altura
- "Minha meta calórica é 2000 kcal" - Define meta calórica

## 6. Solução de Problemas

### Erros Comuns:

1. **"The phone number is not registered with WhatsApp"**:
   - Certifique-se de que o número está registrado no WhatsApp e está usando o formato E.164

2. **"The message was not sent because the recipient is not opted in"**:
   - Você precisa primeiro enviar "Join [código]" do seu WhatsApp pessoal para o sandbox

3. **"Authentication failed"**:
   - Verifique se as credenciais do Twilio (Account SID e Auth Token) estão corretas

### Verificação de Logs:

Verifique os logs do servidor backend para mensagens de erro detalhadas:
```
[Nest] 12345 - 08/20/2025, 10:30:45 AM     LOG [TwilioService] Message sent to +5511982200839: Teste de integração
```

## 7. Limitações do Sandbox

O Twilio Sandbox tem algumas limitações importantes:
- Apenas números verificados podem receber mensagens
- O número do sandbox é compartilhado com outros usuários do Twilio
- Há limites de taxa para envio de mensagens
- Não é adequado para uso em produção

Para uso em produção, você precisará:
1. Solicitar aprovação para usar o WhatsApp Business API
2. Configurar um número oficial do WhatsApp Business
3. Ter uma conta comercial verificada

## 8. Próximos Passos

Após testar com sucesso o sandbox, você pode:
1. Configurar um webhook para receber mensagens do Twilio
2. Testar o processamento de diferentes tipos de mensagens
3. Implementar tratamento de erros mais robusto
4. Adicionar suporte a mídia (imagens, documentos)
5. Configurar monitoramento e alertas para produção