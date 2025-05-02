from app.database.models import Account, Transaction
from app.api.v1.endpoints.accounts.schemas import AccountResponse
from tortoise.contrib.pydantic import pydantic_model_creator
from pydantic import BaseModel
from typing import Optional
from uuid import UUID

TransactionSchema = pydantic_model_creator(Transaction, name="Transaction")

class CreateTransactionSchema(BaseModel):
    description: str
    amount: float
    from_account: Optional[UUID] = None
    to_account: Optional[UUID] = None
    
from pydantic import BaseModel, ConfigDict
from typing import Optional
from uuid import UUID
from datetime import datetime

class TransactionResponse(BaseModel):
    id: UUID
    amount: float
    description: str
    created_at: datetime
    to_account: Optional[UUID] = None
    from_account: Optional[UUID] = None
    model_config = ConfigDict(from_attributes=True, arbitrary_types_allowed=True)