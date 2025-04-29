from app.database.models import Account
from tortoise.contrib.pydantic import pydantic_model_creator
from pydantic import BaseModel, Field
from typing import Annotated
from decimal import Decimal

AccountSchema = pydantic_model_creator(Account, name="Account")

class CreateAccountSchema(BaseModel):
    name: str
    start_balance: Annotated[Decimal, Field(strict=True, allow_inf_nan=True, max_digits=10, decimal_places=2)]