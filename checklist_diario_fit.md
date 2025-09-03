# Checklist Diário Fit - Natuzap

Este checklist foi gerado a partir do arquivo `checkpoint_diario_fit.txt` para focar nos itens de ação.

## Onde Paramos (Pontos de Atenção)

### Problemas de Autenticação
- [ ] **Corrigir:** Login e registro estão falhando com erro 400 (Bad Request).
- [ ] **Investigar:** O backend está reclamando que propriedades não deveriam existir nos DTOs.
- [ ] **Ação:** Investigar melhor os logs do backend e o payload do frontend.

### Integração com WhatsApp
- [ ] **Testar:** Necessário testar a integração completa com o Twilio.

### Dashboard
- [ ] **Verificar:** Necessário verificar se os dados estão sendo exibidos corretamente.
- [ ] **Testar:** Necessário testar a funcionalidade de edição do perfil.

## Próximos Passos

### 1. Resolver Problemas de Autenticação
- [ ] Verificar logs detalhados do backend durante login/registro.
- [ ] Verificar payload enviado pelo frontend.
- [ ] Testar endpoints com curl/Postman.
- [ ] Corrigir validação nos DTOs se necessário.

### 2. Testar Integração com WhatsApp
- [ ] Configurar credenciais reais do Twilio.
- [ ] Testar envio de mensagens para o bot.
- [ ] Verificar se os dados estão sendo salvos no banco.
- [ ] Testar todos os comandos implementados.

### 3. Finalizar Dashboard
- [ ] Verificar exibição correta dos dados.
- [ ] Testar edição do perfil do usuário.
- [ ] Verificar cálculos de IMC e TMB.
- [ ] Testar atualização de peso, altura e meta calórica.

### 4. Preparar Demonstração
- [ ] Criar script de demonstração.
- [ ] Testar fluxo completo do usuário.
- [ ] Preparar dados de exemplo.
- [ ] Documentar funcionalidades principais.

## Tarefas Pendentes Detalhadas

### Backend
- [ ] Corrigir erros de validação nos DTOs de autenticação.
- [ ] Verificar tratamento de erros nos serviços.
- [ ] Testar todos os endpoints com dados reais.

### Frontend
- [ ] Verificar exibição correta dos dados do dashboard.
- [ ] Testar formulários de edição.
- [ ] Verificar tratamento de erros nas requisições.
- [ ] Melhorar feedback visual para o usuário.

### Integração
- [ ] Testar comunicação entre frontend e backend.
- [ ] Testar integração com Twilio.
- [ ] Verificar persistência de dados no banco.

### Documentação
- [ ] Criar script de demonstração.
- [ ] Documentar endpoints da API.
- [ ] Criar guia de instalação e configuração.
