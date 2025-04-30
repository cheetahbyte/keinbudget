from app.api.v1.endpoints.accounts import crud
from app.api.v1.endpoints.accounts.schemas import CreateAccountSchema
from app.database.models import User
from app.core.auth import get_current_user
from fastapi import APIRouter, Depends

router = APIRouter()

@router.post("/")
async def create_account(account_in: CreateAccountSchema, user: User = Depends(get_current_user)):
    return await crud.create_account(account_in.model_dump(), user)