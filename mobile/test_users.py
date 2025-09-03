import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import status

from app import crud
from app.core.config import settings
from app.tests.utils.user import get_user_authentication_headers

# Marca todos os testes neste módulo para usar o loop de eventos do pytest-asyncio
pytestmark = pytest.mark.asyncio


async def test_update_user_me_success(client: AsyncClient, db: AsyncSession) -> None:
    """
    Testa a atualização bem-sucedida do perfil do usuário logado.
    """
    # 1. Cria um usuário e obtém seu token de autenticação
    email = "testuser@example.com"
    password = "testpassword"
    await client.post(
        f"{settings.API_V1_STR}/auth/register",
        json={"email": email, "password": password, "full_name": "Test User"},
    )
    headers = await get_user_authentication_headers(client=client, email=email, password=password)

    # 2. Define os dados para atualização
    update_data = {
        "full_name": "Updated Test User",
        "phone_number": "whatsapp:+15551234567"
    }

    # 3. Envia a requisição PUT para o endpoint /users/me
    r = await client.put(f"{settings.API_V1_STR}/users/me", headers=headers, json=update_data)
    updated_user = r.json()

    # 4. Verifica se a resposta da API está correta
    assert r.status_code == status.HTTP_200_OK
    assert updated_user
    assert updated_user["email"] == email
    assert updated_user["full_name"] == update_data["full_name"]
    assert updated_user["phone_number"] == update_data["phone_number"]

    # 5. Verifica se os dados foram realmente atualizados no banco de dados
    db_user = await crud.user.get_by_email(db, email=email)
    assert db_user
    assert db_user.full_name == update_data["full_name"]
    assert db_user.phone_number == update_data["phone_number"]


async def test_update_user_me_duplicate_phone(client: AsyncClient) -> None:
    """
    Testa a falha ao tentar atualizar com um número de telefone que já está em uso.
    """
    # 1. Cria o usuário 1 com um número de telefone
    email1 = "user1@example.com"
    password = "password123"
    phone1 = "whatsapp:+15551112222"
    await client.post(
        f"{settings.API_V1_STR}/auth/register",
        json={"email": email1, "password": password, "phone_number": phone1},
    )

    # 2. Cria o usuário 2 e obtém seu token
    email2 = "user2@example.com"
    await client.post(
        f"{settings.API_V1_STR}/auth/register",
        json={"email": email2, "password": password},
    )
    headers2 = await get_user_authentication_headers(client=client, email=email2, password=password)

    # 3. Usuário 2 tenta usar o número do usuário 1
    r = await client.put(f"{settings.API_V1_STR}/users/me", headers=headers2, json={"phone_number": phone1})

    # 4. Verifica se a API retornou o erro esperado
    assert r.status_code == status.HTTP_400_BAD_REQUEST
    error_detail = r.json()["detail"]
    assert "Este número de telefone já está em uso" in error_detail


async def test_update_user_me_unauthorized(client: AsyncClient) -> None:
    """
    Testa a falha ao tentar atualizar o perfil sem um token de autenticação.
    """
    # 1. Envia a requisição sem o cabeçalho de autorização
    r = await client.put(f"{settings.API_V1_STR}/users/me", json={"full_name": "No Auth User"})

    # 2. Verifica se a API retornou o erro de não autorizado
    assert r.status_code == status.HTTP_401_UNAUTHORIZED