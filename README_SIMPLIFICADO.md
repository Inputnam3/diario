# NutriBot - Versão Simplificada

## Estrutura Simplificada

Esta é uma versão simplificada do nosso sistema de rastreamento nutricional via WhatsApp, inspirada em uma arquitetura mais leve.

### Endpoints

- `POST /simplified/webhook` - Webhook para receber mensagens do WhatsApp

### Como Funciona

1. O usuário envia uma mensagem descrevendo o que comeu pelo WhatsApp
2. O sistema recebe o webhook do Twilio
3. A mensagem é processada com IA (OpenAI) para extrair informações nutricionais
4. Uma resposta formatada é enviada de volta ao usuário

### Tratamento de Mídia

- Áudio: Resposta informando que em breve será possível transcrever
- Imagem: Resposta informando que em breve será possível analisar imagens
- Texto: Processamento com IA para extrair informações nutricionais

### Validação de Webhook

Em ambiente de produção, o sistema valida a assinatura do Twilio para garantir segurança.

## Configuração

As mesmas variáveis de ambiente do sistema principal são utilizadas:
- `OPENAI_API_KEY`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_NUMBER`

## Testes

Para testar, configure o webhook do Twilio Sandbox para apontar para:
`https://seu-ngrok.ngrok.io/simplified/webhook`

Então envie uma mensagem do WhatsApp para o número sandbox.