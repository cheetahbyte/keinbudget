from fastapi import APIRouter, Depends
from app.core.auth import get_current_user
from app.api.v1.endpoints.categories.schemas import CreateCategorySchema, CategoryResponse
from app.api.v1.endpoints.categories import crud
from app.database.models import User
from typing import List
from uuid import UUID

router = APIRouter()

@router.get("/", response_model=List[CategoryResponse])
async def get_categories(user: User = Depends(get_current_user)):
    categories = await crud.get_categories(user)
    result = []
    for c in categories:
        result.append(
            CategoryResponse(
                id = c.id,
                name=c.name,
                user=user.id,
                description = c.description,
                icon=c.icon,
                created_at = c.created_at,
            )
        )
    return result

@router.post("/", response_model=CategoryResponse)
async def create_categories(data: CreateCategorySchema, user: User = Depends(get_current_user)):
    categories = await crud.create_category(data.model_dump(), user)
    return CategoryResponse(
        id=categories.id,
        name=categories.name,
        user=user.id,
        description=categories.description,
        icon=categories.icon,
        created_at=categories.created_at,
    )

@router.get("/{id}", response_model=CategoryResponse)
async def get_transaction_by_id(id: UUID, user: User = Depends(get_current_user)):
    category = await crud.get_category_by_id(id, user)
    return CategoryResponse(
        id=category.id,
        name=category.name,
        user=user.id,
        description=category.description,
        icon=category.icon,
        created_at=category.created_at,
    )
    
@router.delete("/{id}")
async def delete_category_by_id(id: UUID, user: User = Depends(get_current_user)):
    await crud.delete_category_by_id(id, user)
    return {"deleted": str(id)}