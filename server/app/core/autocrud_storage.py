from typing import Type, List, Optional
from tortoise.models import Model as TortoiseModel
from app.api.v1.endpoints.categories.schemas import (
    CategoryResponse,
    CreateCategorySchema,
)
from app.database.models import User
from fastapi_autocrud.storage.base import StorageBackend


class UserCategoryTortoiseStorage(
    StorageBackend[CategoryResponse, CreateCategorySchema, CreateCategorySchema]
):
    def __init__(
        self, db_model: Type[TortoiseModel], output_model: Type[CategoryResponse]
    ):
        self.db_model = db_model
        self.output_model = output_model

    async def list(self, user: User) -> List[CategoryResponse]:
        objs = await self.db_model.filter(user=user)
        return [self.output_model.model_validate(obj) for obj in objs]

    async def create(self, obj: CreateCategorySchema, user: User) -> CategoryResponse:
        db_obj = await self.db_model.create(**obj.model_dump(), user=user)
        return self.output_model.model_validate(db_obj)

    async def get(self, id: str, user: User) -> Optional[CategoryResponse]:
        obj = await self.db_model.get_or_none(id=id, user=user)
        if obj:
            return self.output_model.model_validate(obj)
        return None

    async def update(
        self, id: str, obj: CreateCategorySchema, user: User
    ) -> CategoryResponse:
        db_obj = await self.db_model.get(id=id, user=user)
        for field, value in obj.model_dump(exclude_unset=True).items():
            setattr(db_obj, field, value)
        await db_obj.save()
        return self.output_model.model_validate(db_obj)

    async def delete(self, id: str, user: User) -> None:
        await self.db_model.filter(id=id, user=user).delete()
