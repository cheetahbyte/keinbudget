from fastapi import APIRouter, Depends
from app.core.auth import get_current_user
from app.api.v1.endpoints.transactions.schema import (
    TransactionResponse,
    CreateTransactionSchema,
)
from app.api.v1.endpoints.transactions import crud
from app.database.models import User
from typing import List
from uuid import UUID

router = APIRouter()


@router.get("/", response_model=List[TransactionResponse])
async def get_transactions(user: User = Depends(get_current_user)):
    transactions = await crud.get_transactions(user)
    result = []
    for t in transactions:
        result.append(
            TransactionResponse(
                id=t.id,
                to_account=t.to_account.id if t.to_account else None,
                from_account=t.from_account.id if t.from_account else None,
                amount=t.amount,
                description=t.description,
                created_at=t.created_at
            )
        )
    return result


@router.post("/", response_model=TransactionResponse)
async def create_transaction(
    data: CreateTransactionSchema, user: User = Depends(get_current_user)
):
    return await crud.create_transaction(data.model_dump(), user)


@router.get("/{id}", response_model=TransactionResponse)
async def get_transaction_by_id(id: UUID, user: User = Depends(get_current_user)):
    return await crud.get_transaction_by_id(id, user)
