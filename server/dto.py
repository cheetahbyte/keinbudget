from pydantic import BaseModel, ConfigDict
from database import _AccountBase
class BaseAccountModel(BaseModel):
    id: int = 0
    name: str

class Account(BaseAccountModel):
    balance: float = 0.0

class ExternalAccount(BaseAccountModel):
    pass


## DTO

class AccountCreateDTO(BaseModel):
    name: str
    balance: float | None = 0.0


class ExternalAccountCreateDTO(BaseModel):
    name: str


class TransactionCreateDTO(BaseModel):
    fr: str | _AccountBase
    to: str | _AccountBase
    amount: float
    description: str | None = None
    currency: str | None = None

    model_config: ConfigDict = {
        'arbitrary_types_allowed': True
    }

class UserCreateDTO(BaseModel):
    name: str
    email: str
    password: str