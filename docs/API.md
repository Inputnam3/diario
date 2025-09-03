# Documentação da API Diário Fit

Esta documentação descreve os endpoints disponíveis na API do Diário Fit.

## Autenticação

A API usa autenticação baseada em JWT (JSON Web Tokens). Inclua o token no cabeçalho das requisições:

```
Authorization: Bearer seu-token-aqui
```

## Endpoints

### Autenticação

#### `POST /api/auth/register`

Registra um novo usuário.

**Corpo da Requisição:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123",
  "name": "Nome do Usuário"
}
```

**Resposta de Sucesso (201):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "usuario@exemplo.com",
  "name": "Nome do Usuário",
  "createdAt": "2023-08-06T04:00:00.000Z"
}
```

#### `POST /api/auth/login`

Autentica um usuário e retorna um token JWT.

**Corpo da Requisição:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Resposta de Sucesso (200):**
```json
{
  "access_token": "seu-jwt-token-aqui",
  "expires_in": 86400
}
```

### Alimentos

#### `GET /api/foods`

Lista todos os alimentos cadastrados.

**Parâmetros de Consulta:**
- `search` (opcional): Termo para busca
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10)

**Resposta de Sucesso (200):**
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Maçã",
      "calories": 52,
      "protein": 0.3,
      "carbs": 14,
      "fat": 0.2
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

#### `POST /api/foods`

Adiciona um novo alimento.

**Cabeçalho:**
```
Authorization: Bearer seu-token-aqui
Content-Type: application/json
```

**Corpo da Requisição:**
```json
{
  "name": "Banana",
  "calories": 89,
  "protein": 1.1,
  "carbs": 22.8,
  "fat": 0.3
}
```

**Resposta de Sucesso (201):**
```json
{
  "id": "223e4567-e89b-12d3-a456-426614174000",
  "name": "Banana",
  "calories": 89,
  "protein": 1.1,
  "carbs": 22.8,
  "fat": 0.3,
  "createdAt": "2023-08-06T04:00:00.000Z"
}
```

### Refeições

#### `POST /api/meals`

Registra uma nova refeição.

**Cabeçalho:**
```
Authorization: Bearer seu-token-aqui
Content-Type: application/json
```

**Corpo da Requisição:**
```json
{
  "foodId": "123e4567-e89b-12d3-a456-426614174000",
  "quantity": 100,
  "mealType": "lunch",
  "consumedAt": "2023-08-06T12:00:00.000Z"
}
```

**Resposta de Sucesso (201):**
```json
{
  "id": "323e4567-e89b-12d3-a456-426614174000",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "foodId": "123e4567-e89b-12d3-a456-426614174000",
  "quantity": 100,
  "calories": 52,
  "mealType": "lunch",
  "consumedAt": "2023-08-06T12:00:00.000Z",
  "createdAt": "2023-08-06T04:00:00.000Z"
}
```

### Atividades Físicas

#### `POST /api/activities`

Registra uma nova atividade física.

**Cabeçalho:**
```
Authorization: Bearer seu-token-aqui
Content-Type: application/json
```

**Corpo da Requisição:**
```json
{
  "activityType": "running",
  "duration": 30,
  "intensity": "moderate",
  "caloriesBurned": 300,
  "performedAt": "2023-08-06T18:00:00.000Z"
}
```

**Resposta de Sucesso (201):**
```json
{
  "id": "423e4567-e89b-12d3-a456-426614174000",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "activityType": "running",
  "duration": 30,
  "intensity": "moderate",
  "caloriesBurned": 300,
  "performedAt": "2023-08-06T18:00:00.000Z",
  "createdAt": "2023-08-06T04:00:00.000Z"
}
```

### Relatórios

#### `GET /api/reports/daily-summary`

Obtém um resumo diário de calorias e atividades.

**Parâmetros de Consulta:**
- `date` (opcional): Data no formato YYYY-MM-DD (padrão: hoje)

**Resposta de Sucesso (200):**
```json
{
  "date": "2023-08-06",
  "caloriesConsumed": 1850,
  "caloriesBurned": 450,
  "remainingCalories": 1400,
  "macros": {
    "protein": {
      "total": 120,
      "goal": 150,
      "percentage": 80
    },
    "carbs": {
      "total": 200,
      "goal": 250,
      "percentage": 80
    },
    "fat": {
      "total": 50,
      "goal": 65,
      "percentage": 77
    }
  },
  "meals": [
    {
      "id": "323e4567-e89b-12d3-a456-426614174000",
      "foodName": "Arroz integral",
      "quantity": 100,
      "calories": 130,
      "mealType": "lunch",
      "consumedAt": "2023-08-06T12:30:00.000Z"
    }
  ],
  "activities": [
    {
      "id": "423e4567-e89b-12d3-a456-426614174000",
      "activityType": "running",
      "duration": 30,
      "caloriesBurned": 300,
      "performedAt": "2023-08-06T18:00:00.000Z"
    }
  ]
}
```

## Integração com WhatsApp

### `POST /api/whatsapp/webhook`

Webhook para receber mensagens do WhatsApp.

**Corpo da Requisição (exemplo):**
```json
{
  "message": "Adicionei 100g de arroz integral no almoço",
  "from": "5511999999999",
  "timestamp": 1628208000
}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Refeição registrada com sucesso",
  "data": {
    "food": "Arroz integral",
    "quantity": 100,
    "calories": 130,
    "mealType": "lunch"
  }
}
```

## Códigos de Status

- `200 OK`: Requisição bem-sucedida
- `201 Created`: Recurso criado com sucesso
- `400 Bad Request`: Dados inválidos ou ausentes
- `401 Unauthorized`: Autenticação necessária
- `403 Forbidden`: Acesso negado
- `404 Not Found`: Recurso não encontrado
- `500 Internal Server Error`: Erro no servidor
