from pydantic import BaseModel, EmailStr, StringConstraints, Field
from typing import Annotated

class LoginData(BaseModel):
    email: EmailStr = Field(alias="username")
    password: Annotated[str, StringConstraints(min_length=6)] 