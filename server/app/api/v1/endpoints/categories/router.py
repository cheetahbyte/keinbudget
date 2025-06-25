from fastapi import Depends
from app.core.auth import get_current_user
from app.database.models import Category
from app.api.v1.endpoints.categories.schemas import (
    CategoryResponse,
    CreateCategorySchema,
    UpdateCategorySchema,
)
from app.core.autocrud_storage import UserCategoryTortoiseStorage
from fastapi_autocrud.router import generate_crud_router

storage = UserCategoryTortoiseStorage(Category, CategoryResponse)

router = generate_crud_router(
    output_model=CategoryResponse,
    create_model=CreateCategorySchema,
    update_model=UpdateCategorySchema,
    storage=storage,
    dependencies={
        "list": [Depends(get_current_user)],
        "create": [Depends(get_current_user)],
        "get": [Depends(get_current_user)],
        "update": [Depends(get_current_user)],
        "delete": [Depends(get_current_user)],
    },
)
