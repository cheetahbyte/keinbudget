from tortoise.contrib.pydantic import pydantic_model_creator
from app.database.models import User
from pydantic import BaseModel, EmailStr, StringConstraints
from typing import Annotated

UserSchema = pydantic_model_creator(User, name="User")
UserOutSchema = pydantic_model_creator(User, name="UserOut", exclude=("password",))

class UserCreateSchema(BaseModel):
    first_name: str
    last_name: str | None
    email: EmailStr
    password: Annotated[str, StringConstraints(min_length=6)]