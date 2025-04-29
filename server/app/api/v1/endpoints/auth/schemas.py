from pydantic import BaseModel, EmailStr, StringConstraints
from typing import Annotated

class LoginData(BaseModel):
    email: EmailStr
    password: Annotated[str, StringConstraints(min_length=6)]