# Checklist de Desenvolvimento do Projeto Natuzap

## 1. Início (Home.tsx)
- [x] Adicionar seletor de data
- [x] Atualizar chamadas da API para passar a data selecionada
- [x] Atualizar chaves do React Query para incluir a data
- [x] Testar a funcionalidade (corrigimos os erros)
- [x] Adicionar redirecionamento para onboarding se o perfil estiver incompleto
- [x] Corrigir problema com data selecionada (dia anterior)
- [ ] Identificado: Substituir dados mockados das metas por dados reais
- [ ] Identificado: Criar menu para escolher metas

## 2. Perfil (Perfil.tsx)
- [ ] Determinar se é necessário filtrar por data
- [ ] Se necessário, implementar a funcionalidade de filtro de data

## 3. Registro (Registro.tsx)
- [x] Já implementa seleção e filtragem por data
- [ ] Testar a funcionalidade

## 4. Atividades (Atividades.tsx)
- [ ] Determinar se é necessário filtrar por data
- [ ] Se necessário, implementar a funcionalidade de filtro de data

## 5. Relatórios (Relatorios.tsx)
- [x] Atualizado para buscar dados em tempo real da API
- [x] Implementado filtro de data/período
- [ ] Testar a funcionalidade

## 6. WhatsApp (Whatsapp.tsx)
- [ ] Determinar se é necessário filtrar por data
- [ ] Se necessário, implementar a funcionalidade de filtro de data

## 7. Configurações (Config.tsx)
- [ ] Determinar se é necessário filtrar por data
- [ ] Se necessário, implementar a funcionalidade de filtro de data

## 8. Onboarding
- [x] Criar estrutura de pastas e componentes básicos
- [x] Criar página de Boas-vindas
- [x] Criar página de Informações Pessoais
- [x] Criar página de Métricas Corporais
- [x] Criar página de Nível de Atividade
- [x] Criar página de Preferências Alimentares
- [x] Criar página de Definição de Metas
- [x] Criar página de Resultados Preliminares
- [x] Implementar navegação entre etapas
- [x] Implementar lógica para salvar dados do perfil
- [x] Implementar cálculo de IMC, TMB e meta calórica
- [x] Adicionar verificação de perfil incompleto e redirecionamento
- [x] Corrigir problemas com campos extras no backend
- [x] Corrigir redirecionamento após salvamento
- [x] Testar a funcionalidade

## 9. Gestão de Metas
- [x] Criar página de configuração de metas
- [x] Adicionar campos de metas à entidade User (backend)
- [x] Atualizar DTO de atualização de perfil
- [ ] Criar migration para adicionar campos ao banco de dados
- [ ] Atualizar página inicial para buscar e exibir metas reais
- [ ] Adicionar link/navegação para a página de metas