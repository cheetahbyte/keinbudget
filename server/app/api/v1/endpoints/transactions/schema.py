from app.database.models import Transaction
from app.api.v1.endpoints.categories.schemas import CategoryResponse
from tortoise.contrib.pydantic import pydantic_model_creator
from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from pydantic import ConfigDict
from datetime import datetime

TransactionSchema = pydantic_model_creator(Transaction, name="Transaction")

class CreateTransactionSchema(BaseModel):
    description: str
    amount: float
    category: Optional[UUID|str] = None
    from_account: Optional[UUID] = None
    to_account: Optional[UUID] = None
    created_at: datetime
    
class EditTransactionSchema(BaseModel):
    description: Optional[str] = None
    amount: Optional[float] = None
    category: Optional[UUID|str] = None
    from_account: Optional[UUID] = None
    to_account: Optional[UUID] = None
    created_at: Optional[datetime] = None


class TransactionResponse(BaseModel):
    id: UUID
    amount: float
    description: str
    category: Optional[CategoryResponse] = None
    created_at: datetime
    to_account: Optional[UUID] = None
    from_account: Optional[UUID] = None
    model_config = ConfigDict(from_attributes=True, arbitrary_types_allowed=True)