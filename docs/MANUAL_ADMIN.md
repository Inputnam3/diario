# Manual do Administrador - Diário Fit

## 1. Introdução

Este manual destina-se aos administradores do sistema Diário Fit. Ele cobre as funcionalidades de gerenciamento, configuração e monitoramento da plataforma.

## 2. Visão Geral da Arquitetura

- **Componentes:** Breve descrição do Frontend, Backend e Banco de Dados e como eles se comunicam.
- **Fluxo de Dados:** Como a informação (mensagens, status) flui através do sistema.

## 3. Gerenciamento de Usuários

- **Visualizar Usuários:** Como listar todos os usuários cadastrados no sistema.
- **Criar um Novo Usuário:** Passo a passo para adicionar um novo membro à equipe.
- **Editar Permissões:** Como alterar as permissões de um usuário (se aplicável).
- **Redefinir Senhas:** Como forçar a redefinição de senha para um usuário.
- **Desativar um Usuário:** Como remover o acesso de um usuário sem excluir seu histórico.

## 4. Configurações do Sistema

Esta seção descreve as configurações que afetam todo o sistema. A maioria delas é gerenciada através das variáveis de ambiente no arquivo `.env` do backend.

- **Integração com a Twilio:**
  - `TWILIO_ACCOUNT_SID`
  - `TWILIO_AUTH_TOKEN`
  - `TWILIO_WHATSAPP_NUMBER`
  - **Webhook:** Como configurar a URL do webhook na plataforma da Twilio para receber as respostas das mensagens.

- **Configurações de Segurança:**
  - `JWT_SECRET`: A importância de manter esta chave segura.

## 5. Monitoramento e Manutenção

- **Verificando a Saúde do Sistema:** Como usar o endpoint de health check (se disponível) para verificar se o backend está online e conectado ao banco de dados.
- **Visualizando Logs:** Onde encontrar os logs da aplicação para diagnosticar problemas. (Ex: `pm2 logs natuzap-backend`).
- **Backup e Restore:** Recomendações de políticas de backup para o banco de dados PostgreSQL para garantir a segurança dos dados.

---
*Este manual é um documento técnico e deve ser mantido atualizado com qualquer mudança na arquitetura ou no processo de configuração.*
