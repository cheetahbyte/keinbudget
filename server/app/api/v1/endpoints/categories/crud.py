from app.database.models import Category, User
from uuid import UUID

async def create_category(name: str, user: User, description: str | None):
    return await Category.create(name=name, user=user, description=description)

async def get_category_by_id(category_id: UUID, user: User):
    return await Category.get_or_none(id=category_id, user=user)

async def get_categories(user: User):
    return await Category.all().filter(user=user)

async def delete_category_by_id(id: UUID, user: User) -> None:
    category = await Category.get_or_none(id=id, user=user)
    return await category.delete()