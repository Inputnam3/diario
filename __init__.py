from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.crud.base import CRUDBase
from app.models.food_log import FoodLog
from app.schemas.entry import EntryCreate, EntryUpdate

class CRUDEntry(CRUDBase[FoodLog, EntryCreate, EntryUpdate]):
    async def create_with_owner(
        self, db: AsyncSession, *, obj_in: EntryCreate, user_id: int
    ) -> FoodLog:
        """Cria um novo registro associado a um usuário."""
        obj_in_data = obj_in.model_dump()
        db_obj = self.model(**obj_in_data, user_id=user_id)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get_multi_by_owner(
        self, db: AsyncSession, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[FoodLog]:
        """Recupera múltiplos registros de um usuário específico."""
        result = await db.execute(
            select(self.model)
            .filter(self.model.user_id == user_id)
            .order_by(self.model.timestamp.desc())
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

entry = CRUDEntry(FoodLog)