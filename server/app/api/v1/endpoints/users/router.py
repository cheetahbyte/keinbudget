from fastapi import APIRouter, HTTPException, Depends
from app.api.v1.endpoints.users.schemas import UserSchema, UserCreateSchema
from app.api.v1.endpoints.users import crud
from app.database.models import User
from app.core.auth import get_current_user
from uuid import UUID
import os

router = APIRouter()


@router.post("/", response_model=UserSchema)
async def create(user: UserCreateSchema):
    if os.getenv("USER_SIGNUP") == "true":
        user_obj = await crud.create_user(user.dict())
        return user_obj
    else:
        raise HTTPException(status_code=403, detail="User signup is disabled")


@router.get("/me", response_model=UserSchema)
async def get_my_user(user: User = Depends(get_current_user)):
    return user


@router.get("/{user_id}", response_model=UserSchema)
async def get_user(user_id: UUID):
    user = await crud.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return await UserSchema.from_tortoise_orm(user)
