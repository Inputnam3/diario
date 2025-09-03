# Guia de Desenvolvimento Diário Fit

Este documento fornece informações essenciais para desenvolvedores que desejam contribuir com o projeto Diário Fit.

## Estrutura do Projeto

```
diario-fit/
├── backend/           # API e lógica do servidor
│   ├── src/
│   │   ├── config/    # Configurações do aplicativo
│   │   ├── modules/   # Módulos da aplicação
│   │   ├── common/    # Código compartilhado
│   │   └── main.ts    # Ponto de entrada
│   └── test/          # Testes automatizados
│
├── frontend/          # Aplicação web
│   ├── public/        # Arquivos estáticos
│   └── src/
│       ├── components/ # Componentes React
│       ├── pages/      # Rotas da aplicação
│       ├── styles/     # Estilos globais
│       └── utils/      # Utilitários
│
├── mobile/            # Aplicativo móvel (futuro)
└── docs/              # Documentação
```

## Configuração do Ambiente

### Pré-requisitos

- Node.js 18.0.0 ou superior
- PostgreSQL 14 ou superior
- Redis (opcional, para cache)
- Yarn ou npm

### Configuração Inicial

1. **Clonar o repositório**
   ```bash
   git clone [URL_DO_REPOSITÓRIO]
   cd natuzap
   ```

2. **Configurar variáveis de ambiente**
   - Copie o arquivo `.env.example` para `.env`
   - Preencha as variáveis de ambiente necessárias

3. **Instalar dependências**
   ```bash
   # No diretório raiz
   cd backend && npm install
   cd ../frontend && npm install
   ```

4. **Configurar o banco de dados**
   - Crie um banco de dados PostgreSQL
   - Atualize as credenciais no arquivo `.env`

## Executando o Projeto

### Backend

```bash
cd backend
npm run start:dev
```

O servidor estará disponível em `http://localhost:3000`

### Frontend

```bash
cd frontend
npm run dev
```

O frontend estará disponível em `http://localhost:3001`

## Padrões de Código

### Backend (NestJS)

- Use TypeScript
- Siga o padrão de módulos do NestJS
- Documente suas rotas com Swagger
- Escreva testes unitários e de integração

### Frontend (Next.js/React)

- Use componentes funcionais com Hooks
- Utilize TypeScript para tipagem estática
- Siga as convenções do Next.js para roteamento
- Mantenha os estilos com Tailwind CSS

## Fluxo de Desenvolvimento

1. Crie uma branch a partir de `main`
   ```bash
   git checkout -b feature/nome-da-feature
   ```

2. Faça commit das suas alterações
   ```bash
   git add .
   git commit -m "feat: adiciona nova funcionalidade"
   ```

3. Envie as alterações
   ```bash
   git push origin feature/nome-da-feature
   ```

4. Abra um Pull Request para a branch `main`

## Testes

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

## Deploy

O deploy é feito automaticamente através do GitHub Actions quando um PR é mesclado na branch `main`.

## Dúvidas?

Consulte a documentação ou entre em contato com a equipe de desenvolvimento.
