from http.client import HTTPException

from fastapi import APIRouter, Depends
from app.core.auth import get_current_user
from app.api.v1.endpoints.categories.schemas import CategoryResponse
from app.api.v1.endpoints.transactions.schema import (
    TransactionResponse,
    CreateTransactionSchema,
)
from app.api.v1.endpoints.transactions import crud
from app.database.models import User
from typing import List
from uuid import UUID

from app.api.v1.endpoints.transactions.schema import EditTransactionSchema

router = APIRouter()


@router.get("/", response_model=List[TransactionResponse])
async def get_transactions(
    account_id: UUID = None, user: User = Depends(get_current_user)
):
    transactions = await crud.get_transactions(user)
    result = []
    for t in transactions:
        result.append(
            TransactionResponse(
                id=t.id,
                to_account=t.to_account.id if t.to_account else None,
                from_account=t.from_account.id if t.from_account else None,
                category=CategoryResponse(
                    id=t.category.id,
                    icon=t.category.icon,
                    name=t.category.name,
                    user=user.id,
                    description=t.category.description or "",
                    created_at=t.category.created_at,
                )
                if t.category
                else None,
                amount=t.amount,
                description=t.description,
                created_at=t.created_at,
            )
        )
    return result


@router.post("/", response_model=TransactionResponse)
async def create_transaction(
    data: CreateTransactionSchema, user: User = Depends(get_current_user)
):
    transaction = await crud.create_transaction(data.model_dump(), user)
    return TransactionResponse(
        id=transaction.id,
        amount=transaction.amount,
        description=transaction.description,
        to_account=transaction.to_account.id if transaction.to_account else None,
        from_account=transaction.from_account.id if transaction.from_account else None,
        category=CategoryResponse(
            id=transaction.category.id,
            icon=transaction.category.icon,
            user=user.id,
            name=transaction.category.name,
            description=transaction.category.description or "",
            created_at=transaction.category.created_at,
        )
        if transaction.category
        else None,
        created_at=transaction.created_at,
    )


@router.get("/last")
async def get_last_transactions(user: User = Depends(get_current_user), limit: int = 5):
    transactions = await crud.get_last_transaction(limit, user)
    result = []
    for t in transactions:
        result.append(
            TransactionResponse(
                id=t.id,
                to_account=t.to_account.id if t.to_account else None,
                from_account=t.from_account.id if t.from_account else None,
                category=CategoryResponse(
                    id=t.category.id,
                    icon=t.category.icon,
                    user=user.id,
                    name=t.category.name,
                    description=t.category.description or "",
                    created_at=t.category.created_at,
                )
                if t.category
                else None,
                amount=t.amount,
                description=t.description,
                created_at=t.created_at,
            )
        )
    return result


@router.get("/{id}", response_model=TransactionResponse)
async def get_transaction_by_id(id: UUID, user: User = Depends(get_current_user)):
    transaction = crud.get_transaction_by_id(id, user)
    return TransactionResponse(
        id=transaction.id,
        amount=transaction.amount,
        description=transaction.description,
        to_account=transaction.to_account.id if transaction.to_account else None,
        from_account=transaction.from_account.id if transaction.from_account else None,
        category=CategoryResponse(
            id=transaction.category.id,
            icon=transaction.category.icon,
            name=transaction.category.name,
            user=user.id,
            description=transaction.category.description,
            created_at=transaction.category.created_at,
        )
        if transaction.category
        else None,
        created_at=transaction.created_at,
    )

@router.patch("/{txid}", response_model=TransactionResponse)
async def edit_transaction(txid: UUID, data: EditTransactionSchema, user: User = Depends(get_current_user)):
    transaction = await crud.edit_transaction_by_id(txid, data.model_dump(), user)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return TransactionResponse(
        id=transaction.id,
        amount=transaction.amount,
        description=transaction.description,
        to_account=transaction.to_account.id if transaction.to_account else None,
        from_account=transaction.from_account.id if transaction.from_account else None,
        category=CategoryResponse(
            id=transaction.category.id,
            icon=transaction.category.icon,
            name=transaction.category.name,
            user=user.id,
            description=transaction.category.description,
            created_at=transaction.category.created_at,
        )
        if transaction.category
        else None,
        created_at=transaction.created_at,
    )

@router.delete("/{id}")
async def delete_transaction_by_id(id: UUID, user: User = Depends(get_current_user)):
    await crud.delete_transaction_by_id(id, user)
    return {"deleted": str(id)}
