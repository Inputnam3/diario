# Especificação da API Natuzap

## Visão Geral
A API do Natuzap é uma API RESTful que permite o gerenciamento de contagem de calorias com integração ao WhatsApp. A API segue os princípios REST e retorna respostas em JSON.

## Autenticação
A autenticação é feita via JWT (JSON Web Tokens). Inclua o token no cabeçalho `Authorization` das requisições:

```
Authorization: Bearer <seu_token_aqui>
```

## Endpoints

### Autenticação

#### `POST /api/v1/auth/register`
Registra um novo usuário.

**Request:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123",
  "name": "Nome do Usuário",
  "weight_kg": 70.5,
  "height_cm": 175,
  "daily_calorie_goal": 2200
}
```

**Response (201):**
```json
{
  "id": "uuid-do-usuario",
  "email": "usuario@exemplo.com",
  "name": "Nome do Usuário",
  "created_at": "2023-08-06T05:14:31.123Z"
}
```

#### `POST /api/v1/auth/login`
Autentica um usuário e retorna um token JWT.

**Request:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "access_token": "seu-jwt-token-aqui",
  "token_type": "bearer",
  "user": {
    "id": "uuid-do-usuario",
    "email": "usuario@exemplo.com",
    "name": "Nome do Usuário"
  }
}
```

### Alimentos

#### `GET /api/v1/foods`
Lista alimentos cadastrados.

**Query Params:**
- `search`: Termo para busca
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 20)

**Response (200):**
```json
{
  "items": [
    {
      "id": "uuid-do-alimento",
      "name": "Arroz integral cozido",
      "calories_per_100g": 130,
      "protein_g": 2.7,
      "carbs_g": 25.8,
      "fat_g": 1.0
    }
  ],
  "total": 1,
  "page": 1,
  "pages": 1
}
```

### Registros Diários

#### `POST /api/v1/entries`
Registra uma nova entrada de alimento.

**Request:**
```json
{
  "food_id": "uuid-do-alimento",
  "quantity_g": 150,
  "meal_type": "lunch"
}
```

**Response (201):**
```json
{
  "id": "uuid-da-entrada",
  "user_id": "uuid-do-usuario",
  "food_id": "uuid-do-alimento",
  "food_name": "Arroz integral cozido",
  "quantity_g": 150,
  "calories": 195,
  "protein_g": 4.05,
  "carbs_g": 38.7,
  "fat_g": 1.5,
  "meal_type": "lunch",
  "consumed_at": "2023-08-06T12:30:00Z"
}
```

### Dashboard

#### `GET /api/v1/dashboard/summary`
Retorna o resumo diário do usuário.

**Query Params:**
- `date`: Data no formato YYYY-MM-DD (opcional, padrão: hoje)

**Response (200):**
```json
{
  "date": "2023-08-06",
  "calories": {
    "consumed": 1500,
    "goal": 2200,
    "remaining": 700
  },
  "macros": {
    "protein": {
      "consumed_g": 120,
      "goal_g": 150,
      "percentage": 80
    },
    "carbs": {
      "consumed_g": 200,
      "goal_g": 250,
      "percentage": 80
    },
    "fat": {
      "consumed_g": 50,
      "goal_g": 65,
      "percentage": 77
    }
  },
  "recent_entries": [
    {
      "id": "uuid-da-entrada",
      "food_name": "Arroz integral cozido",
      "quantity_g": 150,
      "calories": 195,
      "meal_type": "lunch",
      "consumed_at": "2023-08-06T12:30:00Z"
    }
  ]
}
```

## Webhook do WhatsApp

### `POST /api/v1/webhooks/whatsapp`
Endpoint para receber mensagens do WhatsApp via Twilio.

**Headers:**
- `X-Twilio-Signature`: Assinatura da requisição
- `Content-Type: application/x-www-form-urlencoded`

**Form Data:**
```
From: +5511999999999
Body: Adicionei 150g de arroz integral no almoço
```

**Response (200):**
```xml
<Response>
    <Message>
        Registrado com sucesso! ✅
        - 150g Arroz integral cozido (195 kcal)
        
        Total hoje: 1500/2200 kcal
    </Message>
</Response>
```

## Códigos de Status

- 200 OK: Requisição bem-sucedida
- 201 Created: Recurso criado com sucesso
- 400 Bad Request: Dados inválidos ou faltando
- 401 Unauthorized: Token inválido ou ausente
- 403 Forbidden: Acesso negado
- 404 Not Found: Recurso não encontrado
- 500 Internal Server Error: Erro no servidor
