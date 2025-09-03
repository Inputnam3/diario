# Alternative AI Services

Serviços de IA alternativos para processamento nutricional, incluindo:

- Processamento de texto
- Transcrição de áudio
- Reconhecimento de alimentos em imagens

## Estrutura

```
alternative-ai/
├── services/
│   ├── google/
│   │   ├── google-vision.service.ts
│   │   └── google-speech.service.ts
│   ├── azure/
│   │   └── azure-vision.service.ts
│   ├── hybrid/
│   │   └── hybrid-nutrition.service.ts
│   └── unified-ai.service.ts
├── example.ts
├── package.json
└── tsconfig.json
```

## Como Usar

1. Instalar dependências:
   ```bash
   npm install
   ```

2. Compilar:
   ```bash
   npm run build
   ```

3. Executar:
   ```bash
   npm start
   ```

## Configuração

Para usar os serviços completos, configure as variáveis de ambiente:

```bash
# Google Cloud (opcional)
export GOOGLE_APPLICATION_CREDENTIALS="/caminho/para/credenciais.json"

# Azure (opcional)
export AZURE_COMPUTER_VISION_ENDPOINT="https://seu-endpoint.cognitiveservices.azure.com/"
export AZURE_COMPUTER_VISION_KEY="sua-chave"

# APIs Nutricionais (opcional)
export SPOONACULAR_API_KEY="sua-api-key"
export EDAMAM_APP_ID="seu-app-id"
export EDAMAM_APP_KEY="sua-app-key"
```

## Desenvolvimento

```bash
# Executar em modo de desenvolvimento
npm run dev

# Limpar arquivos compilados
npm run clean
```