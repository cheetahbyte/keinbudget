from pydantic import (
    BaseModel,
    EmailStr,
    StringConstraints,
    Field,
    ConfigDict
)
from pydantic.alias_generators import to_camel
from typing import Annotated
from uuid import UUID
from datetime import datetime

class UserSchema(BaseModel):
    id: UUID
    email: str
    firstName: str = Field(..., alias="first_name")
    lastName: str | None = Field(None, alias="last_name")
    twofaEnabled: bool = Field(..., alias="twofa_enabled")
    createdAt: datetime = Field(..., alias="created_at")
    modifiedAt: datetime = Field(..., alias="modified_at")
    fullName: str = Field(..., alias="full_name")

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


class UserCreateSchema(BaseModel):
    first_name: str
    last_name: str | None
    email: EmailStr
    password: Annotated[str, StringConstraints(min_length=6)]
