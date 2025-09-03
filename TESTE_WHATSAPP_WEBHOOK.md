# Guia de Teste do Webhook do WhatsApp

Este guia explica como testar a função de webhook do WhatsApp localmente usando o Supabase CLI.

## Pré-requisitos

1. Node.js (v14 ou superior)
2. Supabase CLI instalado globalmente:
   ```bash
   npm install -g supabase
   ```
3. Conta no Supabase e projeto criado
4. Conta no Twilio com WhatsApp Sandbox configurado (opcional, apenas para teste real)

## Configuração Inicial

1. **Clone o repositório** (se ainda não tiver feito)
   ```bash
   git clone <seu-repositorio>
   cd Natuzap
   ```

2. **Instale as dependências**
   ```bash
   npm install node-fetch form-data @supabase/supabase-js
   ```

3. **Configure as variáveis de ambiente**
   Crie um arquivo `.env` na raiz do projeto com:
   ```env
   SUPABASE_URL=sua_url_do_supabase
   SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
   SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico_do_supabase
   TWILIO_AUTH_TOKEN=seu_token_do_twilio
   ```

## Testando Localmente

1. **Inicie o Supabase localmente**
   ```bash
   supabase start
   ```

2. **Aplique as migrações**
   ```bash
   supabase db reset
   ```

3. **Inicie a função localmente**
   ```bash
   supabase functions serve whatsapp-webhook --no-verify-jwt
   ```
   O parâmetro `--no-verify-jwt` é usado apenas para teste local.

4. **Execute os testes**
   Em outro terminal, execute:
   ```bash
   node test-whatsapp-webhook.js
   ```

   Isso irá:
   - Criar um usuário de teste
   - Enviar várias mensagens de teste para o webhook
   - Mostrar as respostas no console

## Testando com o Twilio Sandbox (Opcional)

1. **Exponha seu localhost**
   Use o ngrok para expor sua porta local na internet:
   ```bash
   ngrok http 54321
   ```

2. **Configure o webhook no Twilio**
   No console do Twilio, vá para "Messaging" > "Settings" e configure o webhook para:
   ```
   https://seu-subdominio.ngrok.io/functions/v1/whatsapp-webhook
   ```

3. **Envie uma mensagem**
   Envie uma mensagem para o número do WhatsApp Sandbox do Twilio.

## Solução de Problemas

- **Erro de autenticação**: Verifique se as chaves do Supabase estão corretas
- **Usuário não encontrado**: Verifique se o usuário foi criado corretamente na tabela `profiles`
- **Erro na função**: Verifique os logs do Supabase CLI para mensagens de erro detalhadas

## Próximos Passos

1. Implementar validação de assinatura do Twilio
2. Adicionar mais alimentos ao banco de dados
3. Implementar lógica para lidar com alimentos não encontrados
4. Adicionar mais validações de entrada

## Estrutura do Banco de Dados

- **profiles**: Armazena informações dos usuários
- **foods**: Banco de dados de alimentos com informações nutricionais
- **food_entries**: Registros de consumo de alimentos dos usuários
