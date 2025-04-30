from app.api.v1.endpoints.accounts import crud
from app.api.v1.endpoints.accounts.schemas import CreateAccountSchema
from app.database.models import User
from app.core.auth import get_current_user
from fastapi import APIRouter, Depends
from uuid import UUID

router = APIRouter()

@router.post("/")
async def create_account(account_in: CreateAccountSchema, user: User = Depends(get_current_user)):
    return await crud.create_account(account_in.model_dump(), user)

@router.get("/")
async def get_accounts(user: User = Depends(get_current_user)):
    return await crud.get_accounts(user)

@router.get("/{id}")
async def get_account_by_id(id: UUID, user: User = Depends(get_current_user)):
    return await crud.get_account_by_id(id, user)