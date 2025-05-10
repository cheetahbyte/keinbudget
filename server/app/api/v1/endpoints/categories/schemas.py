from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class CreateCategorySchema(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryResponse(BaseModel):
    id: UUID
    name: str
    user: UUID
    description: Optional[str] = None
    created_at: datetime
