from app.database.models import User
from uuid import UUID
from passlib.hash import argon2

async def create_user(data: dict):
    hashed_password = argon2.hash(data.get("password"))
    return await User.create(**data, password_hash=hashed_password)

async def get_user_by_id(user_id: UUID) -> User | None:
    return await User.get_or_none(id=user_id)