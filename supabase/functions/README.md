# Supabase Functions

Este diretório contém as funções do Supabase para o projeto Diário Fit.

## Funções

### `ingest_whatsapp`

- **Descrição**: Recebe o webhook do Twilio, interpreta a mensagem e grava o registro na tabela `consumptions`.
- **Trigger**: Webhook do Twilio.
- **Arquivo principal**: `ingest_whatsapp/index.ts`.

### `daily_summary`

- **Descrição**: Gera um resumo diário do consumo do usuário e pode enviar via WhatsApp.
- **Trigger**: Cron job (agendamento).
- **Arquivo principal**: `daily_summary/index.ts`.

## Como desenvolver

1. Instale o Deno CLI.
2. Use `supabase functions serve` para testar localmente.
3. Use `supabase functions deploy` para implantar no Supabase.