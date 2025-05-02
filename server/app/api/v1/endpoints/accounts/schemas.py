from app.database.models import Account
from tortoise.contrib.pydantic import pydantic_model_creator
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

AccountSchema = pydantic_model_creator(Account, name="Account")

class CreateAccountSchema(BaseModel):
    name: str
    start_balance: float
    
class AccountResponse(BaseModel):
    id: UUID
    name: str
    start_balance: float
    created_at: datetime
    current_balance: float

    class Config:
        from_attributes = True