from pydantic import model_validator
from pydantic_settings import BaseSettings
from typing import List, Any, Optional

class Settings(BaseSettings):
    """
    Configurações da aplicação carregadas a partir de variáveis de ambiente.
    """
    PROJECT_NAME: str = "NatuFit SaaS"
    API_V1_STR: str = "/api/v1"

    # Configurações de segurança para JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    # Token expira em 7 dias
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7

    # Configurações do banco de dados PostgreSQL
    POSTGRES_SERVER: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    DATABASE_URL: Optional[str] = None

    @model_validator(mode='before')
    def get_database_url(cls, values: dict) -> dict:
        if isinstance(values.get("DATABASE_URL"), str):
            return values
        # Constrói a URL de conexão do banco de dados
        values["DATABASE_URL"] = (
            f"postgresql+asyncpg://{values['POSTGRES_USER']}:{values['POSTGRES_PASSWORD']}@"
            f"{values['POSTGRES_SERVER']}/{values['POSTGRES_DB']}"
        )
        return values

    # Configuração de CORS (Cross-Origin Resource Sharing)
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()