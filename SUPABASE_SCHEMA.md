# Schema do Banco de Dados do Diário Fit

## Tabelas

### `profiles`

Armazena informações do perfil do usuário.

```sql
create table profiles (
  id uuid primary key references auth.users,
  name text,
  age int,
  weight numeric,
  height numeric,
  goal text, -- perda de peso, ganho, manutenção
  created_at timestamptz default now()
);
```

### `consumptions`

Armazena os registros de alimentos/substâncias consumidas pelos usuários.

```sql
create table consumptions (
  id bigint generated always as identity primary key,
  user_id uuid references profiles(id),
  item text,
  quantity numeric,
  unit text,
  calories numeric,
  protein numeric,
  carbs numeric,
  fat numeric,
  fiber numeric,
  micronutrients jsonb, -- vitaminas/minerais detalhados
  consumed_at timestamptz default now()
);
```

### `nutrition_goals`

Armazena as metas nutricionais definidas pelos usuários.

```sql
create table nutrition_goals (
  id bigint generated always as identity primary key,
  user_id uuid references profiles(id),
  calories_target numeric,
  protein_target numeric,
  carbs_target numeric,
  fat_target numeric,
  fiber_target numeric,
  created_at timestamptz default now()
);
```

## Políticas RLS

Todas as tabelas têm RLS (Row Level Security) habilitado e políticas definidas para garantir que cada usuário só possa acessar seus próprios dados.

## Funções

### `ingest_whatsapp`

- **Descrição**: Recebe o webhook do Twilio, interpreta a mensagem e grava o registro na tabela `consumptions`.
- **Trigger**: Webhook do Twilio.

### `daily_summary`

- **Descrição**: Gera um resumo diário do consumo do usuário e pode enviar via WhatsApp.
- **Trigger**: Cron job (agendamento).