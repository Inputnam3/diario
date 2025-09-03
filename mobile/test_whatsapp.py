import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import status

from app import crud, schemas
from app.core.config import settings

# Marca todos os testes neste módulo para usar o loop de eventos do pytest-asyncio
pytestmark = pytest.mark.asyncio


async def test_whatsapp_webhook_success(client: AsyncClient, db: AsyncSession) -> None:
    """
    Testa o recebimento bem-sucedido de uma mensagem pelo webhook do WhatsApp.
    """
    # 1. Cria um usuário com um número de telefone para o teste
    email = "whatsappuser@example.com"
    password = "testpassword"
    phone_number = "whatsapp:+5511999998888"
    user_create_schema = schemas.UserCreate(
        email=email,
        password=password,
        full_name="WhatsApp User",
        phone_number=phone_number
    )
    user = await crud.user.create(db, obj_in=user_create_schema)

    # 2. Define os dados do formulário que a Twilio enviaria
    twilio_form_data = {
        "From": phone_number,
        "Body": "200g peito de frango"
    }

    # 3. Envia a requisição POST para o webhook
    r = await client.post(
        f"{settings.API_V1_STR}/whatsapp/webhook",
        data=twilio_form_data,
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )

    # 4. Verifica as respostas da API
    assert r.status_code == status.HTTP_200_OK
    assert "application/xml" in r.headers["content-type"]
    response_text = r.text
    assert "✅ Registrado!" in response_text
    assert "200g peito de frango" in response_text
    assert "330 kcal" in response_text  # 200g * 1.65 kcal/g

    # 5. Verifica se o registro foi criado corretamente no banco de dados
    entries = await crud.entry.get_multi_by_owner(db, user_id=user.id)
    assert len(entries) == 1
    assert entries[0].description == "200g peito de frango"
    assert entries[0].calories == 330


async def test_whatsapp_webhook_user_not_found(client: AsyncClient) -> None:
    """
    Testa o webhook quando o número de telefone do remetente não está cadastrado.
    """
    twilio_form_data = {
        "From": "whatsapp:+5511000000000",
        "Body": "100g de teste"
    }

    r = await client.post(
        f"{settings.API_V1_STR}/whatsapp/webhook",
        data=twilio_form_data,
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )

    assert r.status_code == status.HTTP_200_OK
    assert "Seu número não está cadastrado" in r.text


async def test_whatsapp_webhook_invalid_message_format(client: AsyncClient, db: AsyncSession) -> None:
    """
    Testa o webhook com uma mensagem em um formato que o parser não consegue entender.
    """
    # Cria um usuário para o teste
    user_create_schema = schemas.UserCreate(email="invalidmsg@example.com", password="pw", phone_number="whatsapp:+5511977776666")
    await crud.user.create(db, obj_in=user_create_schema)

    # Envia uma mensagem com formato inválido
    r = await client.post(
        f"{settings.API_V1_STR}/whatsapp/webhook",
        data={"From": "whatsapp:+5511977776666", "Body": "uma refeição qualquer"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )

    assert r.status_code == status.HTTP_200_OK
    assert "Formato inválido" in r.text