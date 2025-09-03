# Instruções para Configuração e Teste

## 1. Instalação

```bash
cd alternative-ai
npm install
```

## 2. Configuração das Credenciais

### Google Cloud (Opcional)
1. Crie um projeto no Google Cloud Console
2. Ative as APIs Vision e Speech-to-Text
3. Crie uma conta de serviço e baixe o arquivo JSON
4. Defina a variável de ambiente:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="/caminho/para/sua/credencial.json"
   ```

### Azure Cognitive Services (Opcional)
1. Crie um recurso de Computer Vision no Portal do Azure
2. Obtenha o endpoint e a chave
3. Defina as variáveis de ambiente:
   ```bash
   export AZURE_COMPUTER_VISION_ENDPOINT="https://seu-endpoint.cognitiveservices.azure.com/"
   export AZURE_COMPUTER_VISION_KEY="sua-chave"
   ```

### APIs Nutricionais (Opcional)
1. Registre-se em Spoonacular (https://spoonacular.com/food-api) ou Edamam (https://developer.edamam.com/edamam-nutrition-api)
2. Obtenha as chaves de API
3. Defina as variáveis de ambiente:
   ```bash
   export SPOONACULAR_API_KEY="sua-api-key"
   export EDAMAM_APP_ID="seu-app-id"
   export EDAMAM_APP_KEY="sua-app-key"
   ```

## 3. Teste Básico

```bash
npm run dev
```

## 4. Teste com Arquivos Reais

### Para testar com imagem:
1. Coloque um arquivo chamado `exemplo.jpg` na pasta `alternative-ai`
2. No arquivo `example.ts`, descomente o código da seção de processamento de imagem
3. Execute:
   ```bash
   npm run dev
   ```

### Para testar com áudio:
1. Coloque um arquivo chamado `exemplo.wav` na pasta `alternative-ai`
2. No arquivo `example.ts`, descomente o código da seção de processamento de áudio
3. Execute:
   ```bash
   npm run dev
   ```

## 5. Build para Produção

```bash
npm run build
npm start
```

## 6. Execução dos Testes

```bash
npm test
```

## Estratégia de Fallback

Os serviços são configurados para usar a seguinte estratégia de fallback:

1. **Processamento de Imagem**:
   - Primeiro tenta Google Vision
   - Se falhar, tenta Azure Computer Vision
   - Se ambos falharem, usa processamento básico

2. **Transcrição de Áudio**:
   - Primeiro tenta Google Speech-to-Text
   - Se falhar, pode ser configurado para tentar outras opções

3. **Processamento Nutricional**:
   - Primeiro tenta APIs pagas (Spoonacular/Edamam)
   - Se não disponíveis, usa regras e banco de dados local
   - Sempre retorna algum resultado, mesmo que estimado

## Monitoramento de Custos

O sistema foi projetado para minimizar custos:

1. **Limites gratuitos**: Usa os limites gratuitos das APIs antes de gerar custos
2. **Cache local**: Pode ser estendido para cachear resultados frequentes
3. **Processamento híbrido**: Combina IA com regras para reduzir chamadas API
4. **Fallback inteligente**: Usa opções mais econômicas quando disponíveis

## Próximos Passos

1. Implementar testes unitários
2. Adicionar cache para reduzir chamadas API
3. Implementar rate limiting para evitar exceder limites
4. Adicionar métricas de uso e custo
5. Criar dashboard de monitoramento