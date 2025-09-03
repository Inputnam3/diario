# Natuzap Deployment Checklist

## Pré-requisitos
- [ ] Conta no GitHub
- [ ] Conta no Render ou Hostinger
- [ ] Conta no Supabase
- [ ] Conta no Twilio

## Configuração das Credenciais
- [ ] Supabase URL obtido
- [ ] Supabase Anonymous Key obtida
- [ ] Supabase Service Role Key obtida
- [ ] Supabase Database Connection String obtida
- [ ] Twilio Account SID obtido
- [ ] Twilio Auth Token obtido
- [ ] Twilio WhatsApp Number identificado
- [ ] JWT Secret gerado

## Configuração dos Arquivos de Ambiente
### Backend (backend/.env.production)
- [ ] NODE_ENV=production
- [ ] PORT=3000
- [ ] SUPABASE_URL configurada
- [ ] SUPABASE_ANON_KEY configurada
- [ ] SUPABASE_SERVICE_ROLE_KEY configurada
- [ ] SUPABASE_DB_URL configurada
- [ ] JWT_SECRET configurada
- [ ] TWILIO_ACCOUNT_SID configurado
- [ ] TWILIO_AUTH_TOKEN configurado
- [ ] TWILIO_PHONE_NUMBER configurado

### Frontend (frontend/.env.production)
- [ ] VITE_API_URL configurada
- [ ] VITE_SUPABASE_URL configurada
- [ ] VITE_SUPABASE_ANON_KEY configurada

## Build da Aplicação
- [ ] Backend compilado com sucesso (npm run build na pasta backend)
- [ ] Frontend compilado com sucesso (npm run build na pasta frontend)
- [ ] Diretório backend/dist presente
- [ ] Diretório frontend/dist presente

## Migrações do Banco de Dados
- [ ] Supabase CLI instalado
- [ ] Projeto Supabase vinculado
- [ ] Migrações executadas (supabase db push)

## Implantação
### Se usando Render
- [ ] Repositório forkado no GitHub
- [ ] Backend implantado como Web Service
- [ ] Frontend implantado como Static Site
- [ ] Variáveis de ambiente configuradas no Render

### Se usando Hostinger
- [ ] Backend configurado como aplicação Node.js
- [ ] Frontend arquivos dist/ enviados para o servidor
- [ ] Variáveis de ambiente configuradas no Hostinger

## Configuração Pós-Implantação
- [ ] Twilio webhook URL atualizada
- [ ] CORS configurado corretamente no Supabase
- [ ] Teste de integração do WhatsApp realizado
- [ ] Dashboard carregando corretamente