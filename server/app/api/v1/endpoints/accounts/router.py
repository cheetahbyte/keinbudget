from app.api.v1.endpoints.accounts import crud
from app.api.v1.endpoints.accounts.schemas import CreateAccountSchema, AccountResponse
from app.database.models import User
from app.core.auth import get_current_user
from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID

router = APIRouter()

@router.post("/")
async def create_account(account_in: CreateAccountSchema, user: User = Depends(get_current_user)):
    return await crud.create_account(account_in.model_dump(), user)

@router.get("/")
async def get_accounts(user: User = Depends(get_current_user)):
    accounts = await crud.get_accounts(user)

    result = []
    for acc in accounts:
        current = await acc.current_balance()
        result.append(AccountResponse(
            id=acc.id,
            name=acc.name,
            start_balance=acc.start_balance,
            created_at=acc.created_at,
            current_balance=current
        ))

    return result

@router.get("/{id}")
async def get_account_by_id(id: UUID, user: User = Depends(get_current_user)):
    account = await crud.get_account_by_id(id, user)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    current_balance = await account.current_balance()

    return AccountResponse(
        id=account.id,
        name=account.name,
        start_balance=account.start_balance,
        created_at=account.created_at,
        current_balance=current_balance
    )
    
    
@router.delete("/{id}")
async def delete_account_by_id(id: UUID, user: User = Depends(get_current_user)):
    await crud.delete_account_by_id(id, user)
    return {"deleted": str(id)}