# Guia de Instalação - Diário Fit

Este documento fornece as instruções passo a passo para instalar, configurar e executar a aplicação Diário Fit em um ambiente de produção.

## 1. Pré-requisitos

Antes de começar, garanta que os seguintes softwares estejam instalados no servidor de implantação:

- **Node.js**: Versão 18.x ou superior.
- **NPM**: Versão 9.x ou superior (geralmente instalado com o Node.js).
- **Banco de Dados PostgreSQL**: Uma instância do PostgreSQL em execução e acessível pelo servidor do backend.

## 2. Configuração do Backend

O backend é o cérebro da aplicação, responsável pela lógica de negócios e comunicação com o banco de dados e serviços de terceiros.

1.  **Navegue até o diretório do backend:**
    ```bash
    cd backend
    ```

2.  **Instale as dependências:**
    Este comando irá baixar e instalar todos os pacotes necessários para o backend.
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    Copie o arquivo de exemplo `.env.example` para um novo arquivo chamado `.env`.
    ```bash
    cp .env.example .env
    ```
    Agora, edite o arquivo `.env` e preencha as seguintes variáveis com os seus próprios valores:

    - `DATABASE_URL`: A URL de conexão completa para o seu banco de dados PostgreSQL. Ex: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`
    - `TWILIO_ACCOUNT_SID`: Seu Account SID da conta Twilio.
    - `TWILIO_AUTH_TOKEN`: Seu Auth Token da conta Twilio.
    - `TWILIO_WHATSAPP_NUMBER`: O número de telefone do WhatsApp fornecido pela Twilio.
    - `JWT_SECRET`: Uma chave secreta longa e aleatória para a geração de tokens de autenticação.
    - `NODE_ENV`: Defina como `production` para o ambiente de produção.

4.  **Execute o Build:**
    Este comando compila o código TypeScript para JavaScript, otimizado para produção. O resultado será salvo na pasta `dist`.
    ```bash
    npm run build
    ```

5.  **Inicie o Servidor:**
    Para iniciar o servidor em modo de produção, execute:
    ```bash
    npm run start:prod
    ```
    **Recomendação:** Para manter o servidor rodando continuamente, utilize um gerenciador de processos como o `pm2`. Ex: `pm2 start dist/main.js --name diario-fit-backend`.

## 3. Configuração do Frontend

O frontend é a interface com o usuário, com a qual os clientes irão interagir.

1.  **Navegue até o diretório do frontend:**
    ```bash
    cd frontend
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    Copie o arquivo de exemplo `.env.local.example` (ou similar) para `.env.local` e defina a seguinte variável:
    - `VITE_API_URL`: A URL completa onde o backend está sendo executado. Ex: `http://localhost:3000` ou `https://api.seusite.com`

4.  **Execute o Build:**
    Este comando gera os arquivos estáticos otimizados da aplicação na pasta `dist`.
    ```bash
    npm run build
    ```

## 4. Implantação (Deployment)

-   **Backend:** O backend (passo 2) deve estar rodando em um servidor Node.js, preferencialmente gerenciado pelo `pm2`.
-   **Frontend:** O conteúdo da pasta `frontend/dist` deve ser servido por um servidor web como **Nginx** ou **Apache**, ou hospedado em um serviço de sites estáticos como **Vercel**, **Netlify** ou **AWS S3/CloudFront**.

Após seguir estes passos, a aplicação Diário Fit estará instalada e pronta para uso.
