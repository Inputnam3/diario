# Guia de Migrações do Natuzap

Este documento fornece um guia completo para gerenciar migrações de banco de dados no projeto Natuzap, especialmente ao usar o Supabase como provedor de banco de dados.

## Visão Geral

O sistema de migrações do Natuzap foi projetado para:

- Gerenciar alterações de esquema de banco de dados de forma controlada
- Manter um histórico de todas as alterações aplicadas
- Permitir a execução segura em diferentes ambientes (desenvolvimento, teste, produção)
- Suportar tanto o banco de dados local quanto o Supabase

## Estrutura de Diretórios

```
supabase/
└── migrations/           # Scripts SQL de migração
    ├── 000_initial_schema.sql  # Esquema inicial do banco de dados
    ├── 001_initial_data.sql    # Dados iniciais
    └── README.md               # Documentação das migrações

backend/
├── scripts/
│   └── apply-migrations.js  # Script para aplicar migrações
└── ormconfig.ts             # Configuração do TypeORM
```

## Configuração do Ambiente

### Variáveis de Ambiente Necessárias

Certifique-se de que as seguintes variáveis de ambiente estejam configuradas no arquivo `.env` na raiz do projeto:

```env
# Configurações do Supabase
SUPABASE_URL=seu-projeto-url.supabase.co
SUPABASE_ANON_KEY=sua-chave-anon
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role
SUPABASE_DB_URL=postgresql://postgres:senha@db.xxx.supabase.co:5432/postgres

# Configurações do banco de dados local (opcional)
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=natuzap
```

### Instalação de Dependências

Certifique-se de ter instalado as dependências necessárias:

```bash
# No diretório do backend
npm install pg @supabase/supabase-js dotenv
```

## Comandos Disponíveis

### Aplicar Todas as Migrações

```bash
# Aplicar migrações usando o script personalizado
npm run migrate

# Ou usando o TypeORM diretamente (apenas para banco de dados local)
npm run migration:run
```

### Criar uma Nova Migração

1. Crie um novo arquivo SQL no diretório `supabase/migrations/` com o seguinte formato:
   `NNN_descricao_da_migracao.sql` (onde NNN é o próximo número sequencial)

2. Adicione as instruções SQL necessárias para a migração

### Reverter a Última Migração

```bash
# Apenas para banco de dados local
npm run migration:revert
```

### Verificar o Status das Migrações

```bash
# Lista todas as migrações e seu status
npm run migration:show
```

## Boas Práticas

1. **Nomes de Arquivos**: Use nomes descritivos e em minúsculas com underscores
   - Exemplo: `002_add_user_preferences.sql`

2. **Idempotência**: Certifique-se de que as migrações possam ser executadas várias vezes sem causar erros
   - Use `CREATE TABLE IF NOT EXISTS` em vez de `CREATE TABLE`
   - Use `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`

3. **Transações**: Agrupe operações relacionadas em transações
   ```sql
   BEGIN;
     -- Suas alterações aqui
   COMMIT;
   ```

4. **Rollback**: Inclua comentários sobre como reverter a migração, se necessário

5. **Dados de Teste**: Separe os dados de teste em migrações separadas com o sufixo `_test.sql`

## Solução de Problemas Comuns

### Erro de Conexão com o Banco de Dados

1. Verifique se as variáveis de ambiente estão corretamente configuradas
2. Verifique se o banco de dados está acessível a partir da sua rede
3. Para o Supabase, verifique se o endereço IP está na lista de permissões

### Erro de Permissão

Certifique-se de que o usuário do banco de dados tem permissões suficientes para:
- Criar e modificar tabelas
- Executar migrações
- Acessar os esquemas necessários

### Migração Falhou

1. Verifique os logs de erro para identificar o problema
2. Se possível, reverta a migração com falha
3. Corrija o script de migração e tente novamente

## Migrações no Ambiente de Produção

1. **Sempre faça backup** do banco de dados antes de aplicar migrações em produção
2. Teste as migrações em um ambiente de teste primeiro
3. Considere usar uma janela de manutenção para aplicar migrações que possam causar bloqueios
4. Monitore o desempenho após a aplicação das migrações

## Recursos Adicionais

- [Documentação do Supabase](https://supabase.com/docs/guides/database)
- [Documentação do PostgreSQL](https://www.postgresql.org/docs/)
- [Guia de Migrações do TypeORM](https://typeorm.io/#/migrations)
